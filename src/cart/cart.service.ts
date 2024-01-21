import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CartDetail,
  CartDetailDocument,
} from 'src/cart-detail/schemas/car-detail.schemas';
import { Cart, CartDocument } from './schemas/cart.schemas';
import { Query } from 'express-serve-static-core';
import { Product, ProductDocument } from 'src/product/schemas/product.schemas';
@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartDetail.name)
    private cartDetailModel: Model<CartDetailDocument>,
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findAll(query: Query): Promise<any> {
    const user: any = query.user;
    const userData = JSON.parse(user);
    const user_id = userData.id;
    return await this.cartModel.find({ user_id: user_id }).populate({
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
  }

  async findById(query: Query, id: string): Promise<any> {
    const user: any = query.user;
    const userData = JSON.parse(user);
    const user_id = userData.id;
    return await this.cartModel.findOne({ _id: id, user_id: user_id });
  }

  async create(query: Query, cart: any): Promise<any> {
    const user: any = query.user;
    const userData = JSON.parse(user);
    const user_id = userData.id;

    const createdCart = new this.cartModel({
      user_id: user_id,
    });

    const cartRes = await this.cartModel.create(createdCart);

    const product = await this.productModel.findOne({ _id: cart.product_id });

    const createdCartDetail = new this.cartDetailModel({
      cart: cartRes._id, // Use cartRes._id instead of cartRes.id
      product: cart.product_id,
      qty: cart.qty,
      total_price: product.price * cart.qty,
    });

    const cartDetail = await this.cartDetailModel.create(createdCartDetail);

    // Update the details field in the Cart model
    await this.cartModel.findByIdAndUpdate(cartRes._id, {
      $push: { cart_details: cartDetail._id },
    });

    const result = {
      _id: createdCart._id,
      user_id: createdCart.user_id,
      cart_detail: cartDetail,
    };
    return { data: result };
  }
}
