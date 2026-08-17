import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserDocument } from 'src/DB/models';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { OrderRepository } from 'src/DB/repositories';
import { PaymendMethod } from 'src/DB/enums/order.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly _CartService: CartService,
    private readonly _ProductService: ProductService,
    private readonly _OrderRepository: OrderRepository
  ) {}

  async create(data: CreateOrderDto, user: UserDocument) {
    // get user
    const userId = user._id;

    // check cart if empty
    const cart = await this._CartService.getCart(userId);
    if (!cart || !cart.products.length)
      throw new BadRequestException('Cart is Empty!');
    // check if products in cart is out of stock or not availabe in db
    let price = 0;
    for (const prod of cart.products) {
      const product = await this._ProductService.checkProductExistance(
        prod.productId,
      );

      if (!this._ProductService.inStock(product, prod.quantity))
        throw new BadRequestException(
          `there is only ${product.stock} in the stoc!`,
        );
      price += product.finalPrice * prod.quantity;
    }

    

    
    // create order
    const order = await this._OrderRepository.create({
      ...data,
      user: userId,
      cart: cart._id,
      price,

    })

    // payment if cash
    if(order.paymentMethod == PaymendMethod.cash){

      const products = cart.products

      for (const prd of products) {
        await this._ProductService.updateStock(prd.productId,  prd.quantity, false)
        
      }
      return {message: "done"}
    }



    // payment if card


    // clear cart


    return {data: order, message: 'order created successfully!'};
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
