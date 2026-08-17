import {
  BadRequestException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { subscribe } from 'diagnostics_channel';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { TokenRepository, UserRepository } from 'src/DB/repositories';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  socketUsers = new Map<string, Socket>();

  constructor(
    private readonly _ConfigService: ConfigService,
    private readonly _JwtService: JwtService,
    private readonly _UserRepository: UserRepository,
    private readonly _TokenRepository: TokenRepository,
  ) {}

  // on on these events
  async handleConnection(client: Socket) {
    const authHeader = client.handshake?.auth?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer'))
      throw new BadRequestException('Invalid Bearer Token!');

    const token = authHeader.split(' ')[1];

    try {
      const payload = this._JwtService.verify(token, {
        secret: this._ConfigService.get('JWT_SECRET'),
      });

      const user = await this._UserRepository.findOne({
        filter: { _id: payload.id },
      });

      if (!user) throw new NotFoundException('User Not Found!');

      const validToken = await this._TokenRepository.findOne({
        filter: {
          token: token,
          isValid: true,
          user: user._id,
        },
      });
      if (!validToken) throw new UnauthorizedException('Invalid Bearer Token');

      client.data.user = user;
    } catch (error) {
      throw new InternalServerErrorException();
    }

    const userId = client.data.user.id;
    this.socketUsers.set(userId, client);
    console.log(`User connected ${client.id}`);
    console.log(`User connected ${userId}`);
  }

  // on
  handleDisconnect(client: any) {
    this.socketUsers.delete(client.data.user.id);
    console.log(`Client disconnected ${client.data.user.id}`);
  }

  // emit event
  broadcastStockUpdate(productId: Types.ObjectId, newStock: number) {
    this.server.emit('update-stock', {
      productId,
      newStock,
    });
  }

  // listen on event
  @SubscribeMessage('get-data')
  handleGetData(client: Socket,data: any){
    console.log("Recieved get-data event!")

  }

  // send private messate
  
  @SubscribeMessage('private')
  sendMsgPrivate(client: Socket, data: {message: string, recieverId: string}){
    const sender = client.data.user
    const senderId = client.data.user.id

    if(!senderId) return client.emit('error', {message: "Sender Not Authenticated!"})

    const recieverSocket = this.socketUsers.get(data.recieverId)

    if(!recieverSocket) return client.emit('error', {message: "Reciever Not Found!"})
    
    recieverSocket.emit('private', {
      message: data.message,
      from: {id: sender.id, name: sender.name}
    })

  }
}
