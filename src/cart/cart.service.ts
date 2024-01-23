import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CartDetail, CartDetailDocument } from './schemas/car-detail.schemas';
import { Cart, CartDocument } from './schemas/cart.schemas';
import { Query } from 'express-serve-static-core';
import { Product, ProductDocument } from 'src/product/schemas/product.schemas';
import { CreateOrUpdateCartDto } from './dto/create-or-update-cart.dto';
import { CartResponse } from './interface/cart.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartDetail.name)
    private cartDetailModel: Model<CartDetailDocument>,
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findByUser(query: Query): Promise<CartResponse> {
    const user: any = query.user;
    const userData = JSON.parse(user);
    const user_id = userData.id;
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const cart = await this.cartModel.findOne({ user_id: user_id });
      if (!cart) {
        const createdCart = new this.cartModel({
          user_id: user_id,
        });

        await createdCart.save({ session });
        await session.commitTransaction();
        session.endSession();
      }

      const result = await this.cartModel
        .findOne({ user_id: user_id })
        .populate({
          path: 'cart_details',
          populate: {
            path: 'product',
            model: 'Product',
            populate: {
              path: 'product_images',
              model: 'ProductImage',
            },
          },
        });

      return { data: result };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      console.error(err);
      throw err;
    }
  }

  async addOrUpdateCart(
    query: Query,
    carts: CreateOrUpdateCartDto,
  ): Promise<CartResponse> {
    const user: any = query.user;
    const userData = JSON.parse(user);
    const user_id = userData.id;
    const session = await this.connection.startSession();

    const exist_cart = await this.cartModel.findOne({ user_id: user_id });
    if (!exist_cart) {
      const createdCart = new this.cartModel({
        user_id: user_id,
      });
      await createdCart.save();
    }

    try {
      session.startTransaction();

      const cart = await this.cartModel.findOne({ user_id: user_id }).populate({
        path: 'cart_details',
        populate: {
          path: 'product',
          model: 'Product',
          populate: {
            path: 'product_images',
            model: 'ProductImage',
          },
        },
      });
      const cartProductIds = cart.cart_details.map((item) =>
        item.product._id.toString(),
      );

      for (const item of carts.cart_details) {
        const product = await this.productModel.findOne({
          _id: item.product_id,
        });

        if (!product) {
          throw new HttpException(
            `product with id ${item.product_id} not found`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (cartProductIds.includes(item.product_id)) {
          const exist_cart_detail = await this.cartDetailModel.findOne({
            product: item.product_id,
          });
          if (item.qty <= 0) {
            await this.cartDetailModel.findByIdAndDelete(
              exist_cart_detail._id,
              { session },
            );
          } else {
            const updatedCartDetail = new this.cartDetailModel({
              cart: cart._id,
              product: item.product_id,
              qty: item.qty,
              total_price: product.price * item.qty,
            });

            await this.cartDetailModel.findByIdAndUpdate(
              exist_cart_detail._id,
              { ...updatedCartDetail.toObject(), _id: exist_cart_detail._id },
              { session },
            );
          }
        } else {
          const createdCartDetail = new this.cartDetailModel({
            cart: cart._id,
            product: item.product_id,
            qty: item.qty,
            total_price: product.price * item.qty,
          });

          const cartDetail = await createdCartDetail.save({ session });

          await this.cartModel.findByIdAndUpdate(
            cart._id,
            {
              $push: { cart_details: cartDetail._id },
            },
            { session },
          );
        }
      }

      await session.commitTransaction();
      session.endSession();

      const newCart = await this.cartModel
        .findOne({ user_id: user_id })
        .populate({
          path: 'cart_details',
          populate: {
            path: 'product',
            model: 'Product',
          },
        });

      const updateCart = {
        total_product: newCart.cart_details.length,
        total_qty: newCart.cart_details.reduce(
          (total, item) => total + item.qty,
          0,
        ),
        grand_total_price: newCart.cart_details.reduce(
          (total, item) => total + item.total_price,
          0,
        ),
      };

      await this.cartModel.findByIdAndUpdate(cart.id, updateCart);

      const result = await this.cartModel
        .findOne({ user_id: user_id })
        .populate({
          path: 'cart_details',
          populate: {
            path: 'product',
            model: 'Product',
            populate: {
              path: 'product_images',
              model: 'ProductImage',
            },
          },
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

  async deleteCartDetail(id: string): Promise<any> {
    try {
      const cart_detail = await this.cartDetailModel.findOne({ _id: id });
      if (!cart_detail) {
        throw new HttpException('Cart Detail not found', HttpStatus.NOT_FOUND);
      }
      await this.cartDetailModel.findByIdAndDelete(id);

      return {
        message: 'cart detail succesfully deleted',
      };
    } catch (err) {
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
}
