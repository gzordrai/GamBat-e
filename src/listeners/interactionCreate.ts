import { CommandInteraction, Client, Interaction, ButtonInteraction } from "discord.js";
import { Prediction } from "../database/Prediction";
import { commands } from "../bot/commands";
import { ICommand } from "../bot/ICommand";
import { ExtendedClient } from "src/bot/ExtendedClient";

export const interactionCreate = async (client: ExtendedClient, interaction: Interaction): Promise<void> => {
    if (interaction.isCommand())
        await handleSlashCommand(client, interaction);
    else if(interaction.isButton())
        await handleButton(client, interaction);
}

const handleSlashCommand = async (client: ExtendedClient, interaction: CommandInteraction): Promise<void> => {
    const slashCommand: ICommand | undefined = commands.find((c: ICommand) => c.name === interaction.commandName);

    if (!slashCommand)
        interaction.followUp({ content: "An error has occurred" });
    else {
        await interaction.deferReply();
        slashCommand.run(client, interaction);
    }
}

const handleButton = async (client: ExtendedClient, interaction: ButtonInteraction): Promise<void> => {

}