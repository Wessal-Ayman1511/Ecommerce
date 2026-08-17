import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { StripeProvider } from "./payment.provider";





@Module({
    providers: [PaymentService, StripeProvider]
})

export class PaymentModule{}