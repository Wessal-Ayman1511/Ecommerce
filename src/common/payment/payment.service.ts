import { Inject } from "@nestjs/common";
import { STRIPE_CLIENT } from "../constants";
import { Checkout, type Stripe } from "stripe";



export class PaymentService {
    constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe){}


    async createCheckoutSession({line_items, customer_email, discounts, metadata}: Checkout.SessionCreateParams){

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'payment',
            line_items,
            customer_email,
            discounts,
            success_url: "http://localhost:5000/success",
            cancel_url: "http://localhost:5000/cancel",
            metadata
        })
        return session
    }
}