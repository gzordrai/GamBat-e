import { Model, Schema } from "mongoose";
import connection from "../database";

export interface IRole {
    id: string;
    amount: number;
}

export const RoleSchema = new Schema<IRole>({
    id: { type: String, required: true },
    amount: { type: Number, required: true },
});

export const Role: Model<IRole> = connection.model<IRole>("Role", RoleSchema);