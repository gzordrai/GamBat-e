import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { ExtendedClient } from "./ExtendedClient";

export interface Command {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;
    modal: boolean;
    execute: (interaction: ChatInputCommandInteraction<"cached">, client: ExtendedClient | undefined) => Promise<void>;
}