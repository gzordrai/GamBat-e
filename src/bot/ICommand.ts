import { CommandInteraction, ChatInputApplicationCommandData } from "discord.js";
import { ExtendedClient } from "./ExtendedClient";

export interface ICommand extends ChatInputApplicationCommandData {
    run: (client: ExtendedClient, interaction: CommandInteraction) => void;
} 