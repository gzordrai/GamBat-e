import { config } from "dotenv";
import { Connection, createConnection } from "mongoose";
import { join } from "path";

config({ path: join(__dirname, "../../.env") });

const MONGODB_URI: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

const connection: Connection = createConnection(MONGODB_URI);

connection.on("connected", () => console.log(`Connected to ${MONGODB_URI}`));
connection.on("disconnected", () => console.log(`Disconnected to ${MONGODB_URI}`));
connection.on("error", () => {});

export default connection;