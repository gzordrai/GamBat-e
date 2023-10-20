import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const handleButtons = async (interaction: ButtonInteraction<"cached">): Promise<void> => {
    const modal: ModalBuilder = new ModalBuilder()
        .setCustomId(`bet-${interaction.message.id}-${interaction.user.id}`)
        .setTitle(`Pari pour le choix ${interaction.customId.split('-')[1] + 1}`);

    const bet: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("bet")
                .setLabel("Motant du pari")
                .setPlaceholder("16")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
        );

    modal.addComponents(bet);

    interaction.showModal(modal);
}