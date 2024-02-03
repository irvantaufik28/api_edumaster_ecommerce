import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { OrderProduct } from 'src/order/schemas/order-product.schemas';
import {
  Order,
  OrderDocument,
  OrderStatus,
} from 'src/order/schemas/order.schemas';
import {
  Payment,
  PaymentDocument,
  PaymentStatus,
} from './schemas/payment.schema';
import axios from 'axios';
import {
  PaymentPaginationResult,
  PaymentResponse,
} from './interface/payement.interface';
import * as crypto from 'crypto';
import { Query } from 'express-serve-static-core';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    @InjectModel(OrderProduct.name)
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async paidOrder(id: string): Promise<PaymentResponse> {
    const session = await this.connection.startSession();
    const order = await this.orderModel.findOne({ _id: id }).populate({
      path: 'order_products',
    });

    const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

    const payload = {
      transaction_details: {
        order_id: order.code,
        gross_amount: order.grand_total_price,
      },
      item_details: order.order_products.map((product) => ({
        id: product._id,
        price: product.price,
        quantity: product.qty,
        name: product.name,
      })),
      customer_detail: {
        nis: order.nis,
        first_name: order.first_name,
        last_name: order.last_name,
      },
      callbacks: {
        finish: `${process.env.FRONT_END_URI}/order-status?order_id=${order.id}`,
        error: `${process.env.FRONT_END_URI}/order-status?order_id=${order.id}`,
        pending: `${process.env.FRONT_END_URI}/order-status?order_id=${order.id}`,
      },
    };
    session.startTransaction();
    try {
      const response = await axios.post(
        `${process.env.MIDTRANS_APP_URI}/snap/v1/transactions`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Basic ${authString}`,
          },
        },
      );

      if (response.status !== 201) {
        throw new HttpException(
          'Failed to create payment',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const createPayment = new this.paymentModel({
        order_id: order._id,
        order: order._id,
        transaction_id: order.code,
        customer_nis: order.nis,
        customer_name: `${order.first_name} ${order.last_name}`,
        gross_amount: order.grand_total_price,
        snap_token: response.data.token,
        snap_redirect_url: response.data.redirect_url,
        status: PaymentStatus.PENDING,
      });
      const newPayment = await createPayment.save({ session });
      await session.commitTransaction();
      session.endSession();

      const result = await this.paymentModel.findById(newPayment._id).populate({
        path: 'order',
      });

      return { data: result };
    } catch (err) {
      await session.abortTransaction();
      if (err.response && err.response.status === 404) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else if (err instanceof HttpException) {
        throw err;
      } else if (err.response.data.error_messages) {
        const errorMessage = err.response.data.error_messages.join(', ');
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } finally {
      session.endSession();
    }
  }

  async updateStatusBasedOnMidtransResponse(transaction_id: string, data: any) {
    const hash = crypto
      .createHash('sha512')
      .update(
        `${data.order_id}${data.status_code}${data.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
      )
      .digest('hex');

    if (data.signature_key !== hash) {
      throw new HttpException('Invalid Signature key', HttpStatus.BAD_REQUEST);
    }
    let responseData = null;
    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      if (transactionStatus === 'caputre') {
        if (fraudStatus === 'accept') {
          const transaction = await this.paymentModel.updateOne(
            { transaction_id: transaction_id },
            {
              status: PaymentStatus.PAID,
              payment_method: data.payment_method,
              payment_type: data.payment.type,
            },
            { session },
          );

          await this.orderModel.updateOne(
            { code: data.order_id },
            { status: OrderStatus.PAID },
            { session },
          );
          console.log('level 1');
          responseData = transaction;
        } else if (transactionStatus == 'settlement') {
          const transaction = await this.paymentModel.updateOne(
            { transaction_id: transaction_id },
            {
              status: PaymentStatus.PAID,
              payment_method: data.payment_method,
              payment_type: data.payment.type,
            },
            { session },
          );
          await this.orderModel.updateOne(
            { code: data.order_id },
            { status: OrderStatus.PAID },
            { session },
          );
          responseData = transaction;
          console.log('level 2');
        } else if (
          transactionStatus == 'cancel' ||
          transactionStatus == 'deny' ||
          transactionStatus == 'expire'
        ) {
          const transaction = await this.paymentModel.updateOne(
            { transaction_id: transaction_id },
            { status: PaymentStatus.CANCELED },
            { session },
          );
          await this.orderModel.updateOne(
            { code: data.order_id },
            { status: OrderStatus.CANCELED },
            { session },
          );
          responseData = transaction;
          console.log('level 3');
        } else if (transactionStatus == 'pending') {
          const transaction = await this.paymentModel.updateOne(
            { transaction_id: transaction_id },
            { status: PaymentStatus.PENDING },
            { session },
          );
          await this.orderModel.updateOne(
            { code: data.order_id },
            { status: OrderStatus.NOT_PAID },
            { session },
          );
          responseData = transaction;
          console.log('level 4');
        }
      }
      await session.commitTransaction();
      session.endSession();
      console.log('commit');
      return responseData;
    } catch (err) {
      await session.abortTransaction();
      if (err.response && err.response.status === 404) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else if (err instanceof HttpException) {
        throw err;
      } else if (err.response.data.error_messages) {
        const errorMessage = err.response.data.error_messages.join(', ');
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } finally {
      session.endSession();
    }
  }

  async paymentNotif(paymentData: any): Promise<any> {
    const payment = await this.paymentModel.findOne({
      transaction_id: paymentData.order_id,
    });

    if (!payment) {
      throw new HttpException('payment not found', HttpStatus.NOT_FOUND);
    }

    await this.updateStatusBasedOnMidtransResponse(
      paymentData.order_id,
      paymentData,
    );

    return new HttpException('success', HttpStatus.OK);
  }

  async getById(id: string): Promise<PaymentResponse> {
    const payment = await this.paymentModel
      .findOne({ _id: id })
      .populate({
        path: 'order',
        populate: {
          path: 'order_products',
          model: 'OrderProduct',
        },
      })
      .exec();

    if (!payment) {
      throw new HttpException('payment not found', HttpStatus.NOT_FOUND);
    }

    return { data: payment };
  }

  async findAll(query: Query): Promise<PaymentPaginationResult> {
    const page = Number(query.page) || 1;
    const size = Number(query.size) || 10;
    const skip = size * (page - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: new RegExp(String(query.keyword), 'i'),
          },
        }
      : {};

    const customer_nis = query.nis
      ? {
          nis: {
            $regex: new RegExp(String(query.nis), 'i'),
          },
        }
      : {};

    const status = query.status
      ? {
          status: {
            $regex: new RegExp(String(query.status)),
          },
        }
      : {};

    const totalItems = await this.paymentModel.find({
      ...keyword,
      ...status,
      ...customer_nis,
    });

    const payments = await this.paymentModel
      .find({ ...keyword, ...status, ...customer_nis })
      .limit(size)
      .skip(skip)
      .populate({
        path: 'order',
      })
      .exec();

    const result = {
      data: payments,
      paging: {
        page: page,
        total_item: totalItems.length,
        total_page: Math.ceil(totalItems.length / size),
      },
    };

    return result;
  }
}
