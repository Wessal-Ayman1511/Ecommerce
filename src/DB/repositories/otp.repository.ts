import { InjectModel } from "@nestjs/mongoose";
import { OTPDocument, OTPModelName } from "../models/otp.model";
import { AbstractRepository } from "./abstract.repository";
import { Model } from "mongoose";



export class OTPRepository extends AbstractRepository<OTPDocument>{
    constructor(@InjectModel(OTPModelName) OTP:Model<OTPDocument>){
        super(OTP)
    }
}