import { AutocompleteInteraction } from "discord.js";
import { Command, ExtendedClient } from "../bot";

export const handleAutocomplete = async (interaction: AutocompleteInteraction, client: ExtendedClient): Promise<void> => {
    const command: Command = client.commands.get(interaction.commandName)!;

    try {
        if (command.autocomplete)
            await command.autocomplete(interaction, client);
    } catch (error) {
        console.log(error);
    }
}