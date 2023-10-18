import { AutocompleteInteraction, ChatInputCommandInteraction, Collection, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { ExtendedClient } from "./ExtendedClient";

export interface Command {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;
    modal: boolean;
    subcommands?: Collection<string, Subcommand>;
    autocomplete?: (interaction: AutocompleteInteraction, client?: ExtendedClient) => Promise<void>;
    execute: (interaction: ChatInputCommandInteraction<"cached">, client: ExtendedClient | undefined) => Promise<void>;
}

export interface Subcommand {
    modal: boolean;
}