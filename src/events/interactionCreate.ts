import { Events, Interaction } from "discord.js";
import { Command, Event, ExtendedClient } from "../bot";
import { handleModal } from "../handlers/";

const event: Event = {
    name: Events.InteractionCreate,
    once: false,
    async execute(client: ExtendedClient, interaction: Interaction): Promise<void> {
        if (interaction.inCachedGuild()) {
            if (interaction.isChatInputCommand()) {
                const name: string = interaction.commandName;

                if (client.commands.has(name)) {
                    const command: Command = client.commands.get(name)!;

                    if (!command.modal)
                        await interaction.deferReply({ ephemeral: false });

                    await command.execute(interaction, client);
                }
            } else if (interaction.isModalSubmit()) {
                await interaction.deferReply({ ephemeral: false });
                await handleModal(interaction, client);
            }
        }
    },
};

export default event;