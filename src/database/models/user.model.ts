import { Model, Schema, model } from "mongoose";

interface IUser {
    id: string;
    balance: number;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
    id: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 }
});


export const User: Model<IUser, {}, {}> = model("User", UserSchema);