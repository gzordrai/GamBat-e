import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

if (!process.env.DISCORD_TOKEN)
    throw new Error("DISCORD_TOKEN is missing in .env");

if (!process.env.API_TOKEN)
    throw new Error("API_TOKEN is missing in .env");

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const API_TOKEN = process.env.API_TOKEN;