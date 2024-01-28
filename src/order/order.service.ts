import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schemas';
import { Connection, Model } from 'mongoose';
import {
  OrderProduct,
  OrderProductDocument,
} from './schemas/order-product.schemas';

import { Query } from 'express-serve-static-core';
import { Cart, CartDocument } from 'src/cart/schemas/cart.schemas';
import {
  CartDetail,
  CartDetailDocument,
} from 'src/cart/schemas/car-detail.schemas';
import {
  OrderPaginationResult,
  OrderResponse,
} from './interface/order.interface';
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(OrderProduct.name)
    private orderProductModel: Model<OrderProductDocument>,
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    @InjectModel(CartDetail.name)
    private cartDetailModel: Model<CartDetailDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(query: Query): Promise<OrderPaginationResult> {
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

    const categoryFilter = query.category
      ? {
          'category.name': {
            $regex: new RegExp(String(query.category), 'i'),
          },
        }
      : {};

    const totalItems = await this.orderModel.find({
      ...keyword,
      ...categoryFilter,
    });

    const orders = await this.orderModel
      .find({ ...keyword, ...categoryFilter })
      .limit(size)
      .skip(skip)
      .populate('order_products')
      .exec();

    const result = {
      data: orders,
      paging: {
        page: page,
        total_item: totalItems.length,
        total_page: Math.ceil(totalItems.length / size),
      },
    };

    return result;
  }

  async create(query: Query): Promise<OrderResponse> {
    const user: any = query.user;
    const userData = JSON.parse(user);
    const user_id = userData.id;
    const session = await this.connection.startSession();
    const cart = await this.cartModel.findOne({ user_id: user_id }).populate({
      path: 'cart_details',
      populate: [
        {
          path: 'product',
          model: 'Product',
          populate: [
            {
              path: 'category',
              model: 'Category',
            },
            {
              path: 'product_images',
              model: 'ProductImage',
            },
          ],
        },
      ],
    });

    try {
      session.startTransaction();
      if (!cart) {
        throw new HttpException(
          'cart not found cant create order',
          HttpStatus.NOT_FOUND,
        );
      }

      const pendingOrder = await this.orderModel.findOne({
        status: OrderStatus.PENDING,
      });

      if (pendingOrder) {
        throw new HttpException(
          'you have a pending order, please complete the order or cancel to place a new order',
          HttpStatus.BAD_REQUEST,
        );
      }

      const cart_details = cart.cart_details;

      if (cart_details.length <= 0) {
        throw new HttpException(
          'cart is empty  cant create order',
          HttpStatus.NOT_FOUND,
        );
      }
      const createOrder = new this.orderModel({
        user_id: user_id,
        nis: userData.user_detail.nis,
        first_name: userData.user_detail.first_name,
        middle_name: userData.user_detail.middle_name,
        last_name: userData.user_detail.last_name,
        current_classroom_id: userData.user_detail.current_classroom_id,
        family_identity_no: userData.user_detail.family_identity_no,
      });

      const newOrder = await createOrder.save({ session });

      for (const item of cart_details) {
        const createdProductOrder = new this.orderProductModel({
          product_id: item.product._id,
          order_id: newOrder._id,
          name: item.product.name,
          category: item.product.category.name,
          description: item.product.description,
          price: item.product.price,
          product_images: item.product.product_images,
          qty: item.qty,
          total_price: item.total_price,
        });

        const orderProduct = await createdProductOrder.save({ session });

        await this.orderModel.findByIdAndUpdate(
          newOrder.id,
          {
            $push: { order_products: orderProduct._id },
            total_product: cart.total_product,
            total_qty: cart.total_qty,
            grand_total_price: cart.grand_total_price,
          },
          { session },
        );
      }
      await this.cartDetailModel.deleteMany({ cart: cart._id });
      await this.cartModel.findByIdAndDelete(cart._id);
      await session.commitTransaction();
      session.endSession();

      const result = await this.orderModel.findById(newOrder._id).populate({
        path: 'order_products',
      });

      return { data: result };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      console.error(err);
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async findById(_id: string): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({ _id }).populate({
      path: 'order_products',
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return { data: order };
  }
}
