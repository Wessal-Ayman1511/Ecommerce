import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { StockGateway } from "./stock.gateway";







@Module({
    imports: [JwtModule, UserModule],
    providers: [StockGateway],
    exports: [StockGateway]

})

export class SocketModule{

}