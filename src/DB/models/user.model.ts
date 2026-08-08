// schema claass

import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Roles } from "../enums/user.enum";
import { HydratedDocument } from "mongoose";

@Schema({timestamps: true})
class User {
    @Prop({type: String, required: true})
    firstName: string;

    @Prop({type: String, required: true})
    lastName: string;

    @Prop({type: String, required: true, unique:true})
    email: string;

    @Prop({type: String, required: true})
    password: string

    @Prop({type: Boolean, default: false})
    accountActivated:boolean

    @Prop({type: String, default: Roles.USER})
    role: Roles

}


// schema

export const UserSchema = SchemaFactory.createForClass(User)


/// model
export const UserModel = MongooseModule.forFeature([{name: User.name, schema: UserSchema}])


// user type

export type UserDocument = HydratedDocument<User>