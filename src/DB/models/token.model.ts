// schema claass

import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { UserModelName } from "./user.model";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InternalServerErrorException } from "@nestjs/common";

@Schema({timestamps: true})
class Token {
    @Prop({type: String, required:true})
    token: string;

    @Prop({type:Types.ObjectId, ref: UserModelName, required: true})
    user: Types.ObjectId

    @Prop({type: Boolean, default: true})
    isValid: boolean

    @Prop({type: Date})
    expireAt: Date
   
}


// schema
export const TokenSchema = SchemaFactory.createForClass(Token)


// create_index
TokenSchema.index({expireAt:1}, {expireAfterSeconds:0})

// hook
TokenSchema.pre("save", function(){
    if(this.isNew){
        const configService = new ConfigService()
        const jwtService = new JwtService()

        try {
            const payload = jwtService.verify(this.token, {
                secret: configService.get("JWT_SECRET")
            })
            this.expireAt = new Date(payload.exp * 1000)
            
        } catch (error) {
            throw new InternalServerErrorException(error)
            
        }
    }
})


// model name
export const TokenModelName = Token.name



/// model
export const TokenModel = MongooseModule.forFeature([{name: TokenModelName, schema: TokenSchema}])


// Token type
export type TokenDocument = HydratedDocument<Token>