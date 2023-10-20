import { Model, Schema } from "mongoose";
import connection from "../database";

interface IUser {
    id: string;
    balance: number;
}

interface IUserMethods {
    addToBalance: (amount: number) => Promise<void>;
    subsFromBalance: (amount: number) => Promise<void>;
}

interface IUserModel extends Model<IUser> {
    findOneOrCreate: (condition: any, schema: any) => Promise<any>;
}

const UserSchema = new Schema<IUser, IUserModel>({
    id: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 }
})

UserSchema.methods.addToBalance = async function (amount: number): Promise<void> {
    this.balance += amount;

    await this.save();
}

UserSchema.methods.subsFromBalance = async function (amount: number): Promise<void> {
    this.balance -= amount;

    await this.save();
}

UserSchema.static("findOneOrCreate", async function (condition, schema) {
    const user = await User.findOne(condition);

    return user || await User.create(schema);
});

export const User: IUserModel = connection.model<IUser, IUserModel>("User", UserSchema);