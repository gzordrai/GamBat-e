import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";
import { JsonDB } from "node-json-db";

export interface ICommand extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction, database: JsonDB) => void;
} 