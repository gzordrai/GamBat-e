import { HydratedDocument, Model, Schema } from "mongoose";
import connection from "../database";
import { InsufficientBalanceError } from "../errors";

interface IUser {
    id: string;
    balance: number;
    cooldowns: {
        message: Date;
        vocal: Date;
    };
}

export enum Cooldowns {
    MESSAGE = "message",
    VOCAL = "vocal",
}

interface IUserMethods {
    addToBalance: (amount: number) => Promise<void>;
    subsFromBalance: (amount: number) => Promise<void>;
    has: (amount: number) => Promise<boolean>;
    resetCooldown: (cooldown: Cooldowns) => Promise<void>;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {
    findOneOrCreate: (condition: Object, schema: Object) => Promise<HydratedDocument<IUser, IUserMethods>>;
}

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>({
    id: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    cooldowns: {
        message: { type: Date, required: true, default: new Date() },
        vocal: { type: Date, required: true, default: new Date() },
    }
})

UserSchema.methods.addToBalance = async function (amount: number): Promise<void> {
    this.balance += amount;

    await this.save();
}

UserSchema.methods.subsFromBalance = async function (amount: number): Promise<void> {
    if (! await this.has(amount))
        throw new InsufficientBalanceError();

    this.balance -= amount;

    await this.save();
}

UserSchema.methods.has = async function (amount: number): Promise<boolean> {
    return this.balance >= amount;
}

UserSchema.methods.resetCooldown = async function (cooldown: Cooldowns): Promise<void> {
    this.cooldowns[cooldown] = new Date();

    await this.save();
}

UserSchema.static("findOneOrCreate", async function (condition, schema) {
    const user = await User.findOne(condition);

    return user || await User.create(schema);
});

export const User: IUserModel = connection.model<IUser, IUserModel>("User", UserSchema);