import { ConfigService } from "@nestjs/config";
import { STRIPE_CLIENT } from "../constants";
import Stripe from "node_modules/stripe/esm/stripe.esm.node";


export const StripeProvider = {
    provide: STRIPE_CLIENT,
    useFactory: (configService: ConfigService) => new Stripe(configService.get("STRIPE_SECRET_KEY")!),
    inject: [ConfigService]
}