import { CommandInteraction, Client, Interaction } from "discord.js";
import { commands } from "../commands";
import { ICommand } from "../ICommand";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {

        if (interaction.isCommand())
            await handleSlashCommand(client, interaction);
    })
}

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand: ICommand | undefined = commands.find((c: ICommand) => c.name === interaction.commandName);

    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();
    slashCommand.run(client, interaction);
}