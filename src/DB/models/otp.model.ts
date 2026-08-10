import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Mongoose } from "mongoose";
import { hash } from "src/common/security/hash.utils";


// class schema
@Schema({timestamps:true})
export class OTP {
    @Prop({type: String, required:true, unique:true})
    email: string

    @Prop({type: String, required:true})
    otp: string

}

// schema
export const OTPSchema = SchemaFactory.createForClass(OTP)


// hook 
OTPSchema.pre("save", function(next) {
    if(this.isModified("otp")){
        this.otp = hash(this.otp)
    }
})

// create index
OTPSchema.index({createdAt: 1}, {expireAfterSeconds: 120})


// class name
export const OTPModelName = OTP.name


// model
export const OTPModel=  MongooseModule.forFeature([{name:OTPModelName, schema:OTPSchema }])

// otpDocument 
export type OTPDocument = HydratedDocument<OTP>