import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../bot";
import { Prediction } from "../prediction";

export const handleModal = async (interaction: ModalSubmitInteraction<"cached">, client: ExtendedClient): Promise<void> => {
    if (interaction.channel) {
        const timer: number = parseInt(interaction.customId.split('-')[1])
        const predection: Prediction = new Prediction(timer);
        const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();
        let i: number = 1;

        interaction.fields.fields.forEach((field) => {
            if (field.value !== "") {
                if (field.customId.startsWith("choice")) {
                    predection.addChoice({ name: field.value, oods: 1 });
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`choice-${i - 1}`)
                            .setLabel(field.value.substring(0, 80))
                            .setStyle(ButtonStyle.Primary)
                    );

                    i++;
                } else
                    predection.setQuestion(field.value);
            }
        });

        interaction.followUp({ embeds: [predection.createEmbed()], components: [row], ephemeral: false })
            .then((message: Message) => {
                predection.setMessage(message);
                client.predictions.set(message.id, predection);
            })
    }
}