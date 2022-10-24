import { Client, GatewayIntentBits, Partials  } from "discord.js";
import { config } from "dotenv";
import path from "path";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import ready from "./listeners/ready";
import voiceStateUpdate from "./listeners/voiceStateUpdate";

config({ path: path.resolve(__dirname, "../.env") })

const token: string = process.env.TOKEN!;
const client: Client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

console.log("Bot is starting...");

ready(client);
messageCreate(client);
interactionCreate(client);
voiceStateUpdate(client);

client.login(token);