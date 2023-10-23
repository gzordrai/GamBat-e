import { config } from "dotenv";
import { Connection, createConnection } from "mongoose";
import { join } from "path";

config({ path: join(__dirname, process.env.NODE_ENV === "test" ? "../../.env.test" : "../../.env") });

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
const MONGODB_URI: string = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authMechanism=DEFAULT`;

const connection: Connection = createConnection(MONGODB_URI);

connection.on("connected", () => console.log(`Connected to database`));
connection.on("disconnected", () => console.log(`Disconnected to database`));
connection.on("error", () => {});

export default connection;