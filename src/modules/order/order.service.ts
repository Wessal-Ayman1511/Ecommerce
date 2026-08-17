import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserDocument } from 'src/DB/models';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { OrderRepository } from 'src/DB/repositories';
import { PaymendMethod } from 'src/DB/enums/order.enum';
import { PaymentService } from 'src/common/payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly _CartService: CartService,
    private readonly _ProductService: ProductService,
    private readonly _OrderRepository: OrderRepository,
    private readonly _PaymentService: PaymentService,
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
    let products: any = [];
    for (const prod of cart.products) {
      const product = await this._ProductService.checkProductExistance(
        prod.productId,
      );
      if (!this._ProductService.inStock(product, prod.quantity))
        throw new BadRequestException(
          `there is only ${product.stock} in the stoc!`,
        );
      price += product.finalPrice * prod.quantity;

      products.push({
        name: product.name,
        image: product.thumbnail?.secure_url,
        price: product.finalPrice,
        quantity: prod.quantity,
      });
    }

    // create order
    const order = await this._OrderRepository.create({
      ...data,
      user: userId,
      cart: cart._id,
      price,
    });

    // payment if cash
    if (order.paymentMethod == PaymendMethod.cash) {
      const products = cart.products;

      for (const prd of products) {
        await this._ProductService.updateStock(
          prd.productId,
          prd.quantity,
          false,
        );
      }
      return { message: 'done' };
    }

    // payment if card
    if (order.paymentMethod == PaymendMethod.card) {
      const session = await this.paymentWithCard(
        order.id,
        products,
        user.email,
      );
      return { message: 'Payment Completed Successfully!', data: session.url };
    }

    // clear cart

    return { data: order, message: 'order created successfully!' };
  }

  async paymentWithCard(orderId, products, userEmail) {
    const line_items = products.map((prd) => ({
      price_data: {
        currency: 'egp',
        product_data: {
          name: prd.name,
          images: [prd.image],
        },
        unit_amount: prd.price * 100,
      },
      quantity: prd.quantity,
    }));

    const session = await this._PaymentService.createCheckoutSession({
      line_items,
      metadata: { orderId },
      customer_email: userEmail,
    });
    return session;
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
