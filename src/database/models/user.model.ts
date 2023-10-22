import { Model, Schema } from "mongoose";
import connection from "../database";
import { InsufficientBalanceError } from "../errors";

export interface IUser {
    id: string;
    balance: number;
}

interface IUserMethods {
    addToBalance: (amount: number) => Promise<void>;
    subsFromBalance: (amount: number) => Promise<void>;
    has: (amount: number) => Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
    findOneOrCreate: (condition: any, schema: any) => Promise<any>;
}

export const UserSchema = new Schema<IUser, IUserModel, IUserMethods>({
    id: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 }
})

UserSchema.methods.addToBalance = async function (amount: number): Promise<void> {
    this.balance += amount;

    await this.save();
}

UserSchema.methods.subsFromBalance = async function (amount: number): Promise<void> {
    if (!this.has(amount))
        throw new InsufficientBalanceError();

    this.balance -= amount;

    await this.save();
}

UserSchema.methods.has = async function (amount: number): Promise<boolean> {
    return this.balance >= amount;
}

UserSchema.static("findOneOrCreate", async function (condition, schema) {
    const user = await User.findOne(condition);

    return user || await User.create(schema);
});

export const User: IUserModel = connection.model<IUser, IUserModel>("User", UserSchema);