import { GatewayIntentBits } from "discord.js";
import { format, transports } from "winston";
import { AzuriaClient } from "azuria";
import { IBotConfig } from "./types";
import { API_TOKEN, DISCORD_TOKEN } from "./config";

const client: AzuriaClient = new AzuriaClient<IBotConfig>({
    apiKey: API_TOKEN,
    baseDir: __dirname,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [],
    loggerOptions: {
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            new transports.File({ filename: "combined.log" }),
            new transports.Console()
        ]
    }
});

client.start(DISCORD_TOKEN);