// schema claass

import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "../enums/user.enum";
import { HydratedDocument } from "mongoose";
import { hash } from "src/common/security/hash.utils";

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

    @Prop({type: String, default: Role.USER})
    role: Role

}


// schema

export const UserSchema = SchemaFactory.createForClass(User)


// hook
UserSchema.pre('save', function (next) {
    if(this.isModified("password")){
        this.password = hash(this.password)
    }


})

// model name
export const userModelName = User.name
/// model
export const UserModel = MongooseModule.forFeature([{name: userModelName, schema: UserSchema}])


// user type

export type UserDocument = HydratedDocument<User>