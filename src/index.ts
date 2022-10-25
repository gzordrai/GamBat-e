import { Client, ClientOptions, GatewayIntentBits, Interaction, Message, Partials, VoiceState } from "discord.js";
import { config } from "dotenv";
import path from "path";
import { ExtendedClient } from "./bot";
import { interactionCreate, messageCreate, ready, voiceStateUpdate } from "./listeners";

config({ path: path.resolve(__dirname, "../.env") });

const options: ClientOptions = {
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
};
const client: ExtendedClient = new ExtendedClient(options);

console.log("Bot is starting...");

client.on("interactionCreate", async (interaction: Interaction) => await interactionCreate(client, interaction));
client.on("messageCreate", async (message: Message) => await messageCreate(message));
client.once("ready", async (client: Client) => await ready(client));
client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => await voiceStateUpdate(oldState, newState));

client.login(process.env.TOKEN!);