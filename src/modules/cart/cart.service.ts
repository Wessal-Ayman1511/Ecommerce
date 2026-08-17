import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartRepository, ProductRepository } from 'src/DB/repositories';
import { ProductService } from '../product/product.service';
import { Types } from 'mongoose';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    private readonly _CartRepository: CartRepository,
    private readonly _ProductService: ProductService,
    private readonly _ProductRespository: ProductRepository,
  ) {}
  async addToCart(data: CartDto, userId: Types.ObjectId) {
    const { productId, quantity } = data;

    // findProduct -> check if it availe in the storck with the required quantity
    // -> check if produt already in the cart: increase amound->
    // add prod to cart if not found in it

    // find Product
    const product = await this._ProductRespository.findOne({
      filter: { _id: productId },
    });
    if (!product) throw new NotFoundException('Product Not Found!');

    // check product in stock
    if (!this._ProductService.inStock(product, quantity))
      throw new BadRequestException(
        `there is only ${product.stock} items in the stock`,
      );

    // check if cart include product
    const CartIncludeProduct = await this._CartRepository.findOne({
      filter: { user: userId, 'products.productId': productId },
    });

    if (CartIncludeProduct) {
      const ProductInCart = CartIncludeProduct.products.find(
        (prod) => prod.productId.toString() == productId.toString(),
      );

      // check if the required quantity plus the quantiy in the cart in stock
      if (
        this._ProductService.inStock(
          product,
          quantity + ProductInCart?.quantity!,
        )
      ) {
        ProductInCart!.quantity += quantity;
        await CartIncludeProduct.save();
        return { data: CartIncludeProduct };
      } else {
        throw new BadRequestException(
          `there is only ${product.stock - ProductInCart?.quantity!} items in the stock`,
        );
      }
    }

    const addedProduct = await this._CartRepository.update({
      filter: { user: userId },
      update: {
        $push: {
          products: {
            productId,
            quantity,
            price: product.price,
          },
        },
      },
    });
    return { data: addedProduct, message: 'Product Added Successfully' };
  }

  async updateCart(data: CartDto, userId: Types.ObjectId) {
    const { productId, quantity } = data;
    // find Product
    const product = await this._ProductRespository.findOne({
      filter: { _id: productId },
    });
    if (!product) throw new NotFoundException('Product Not Found!');

    // check product in stock
    if (!this._ProductService.inStock(product, quantity))
      throw new BadRequestException(
        `there is only ${product.stock} items in the stock`,
      );

    const cart = await this._CartRepository.update({
      filter: { user: userId, 'products.productId': productId },
      update: {
        'products.$.quantity': quantity,
        'products.$.price': product.finalPrice,
      },
    });
    return { data: cart, message: 'Cart Updated Successfully' };
  }

  async clearCart(userId: Types.ObjectId) {
    const cart = await this._CartRepository.update({
      filter: { user: userId },
      update: { products: [] },
    });

    return { data: cart, message: 'Cart Cleared Successfully!' };
  }

  async getCart(userId: Types.ObjectId) {
    return await this._CartRepository.findOne({ filter: { user: userId } });
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
