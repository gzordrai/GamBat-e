import { ActionRowBuilder, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChatInputCommandInteraction, Collection, ModalBuilder, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, Subcommand } from "../bot/Command";
import { ExtendedClient } from "../bot";
import { Prediction } from "../prediction";
import { Choice } from "../prediction/Choices";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("prediction")
        .setDescription("Gère les prédictions")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName("start")
                .setDescription("Démarre une prédiction")
                .addIntegerOption((option: SlashCommandIntegerOption) =>
                    option
                        .setName("timer")
                        .setDescription("La durée de la prédiction")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName("stop")
                .setDescription("Termine une prédiction en spécifiant le choix gagnant")
                .addStringOption((option: SlashCommandStringOption) =>
                    option
                        .setName("prediction")
                        .setDescription("La prédiction qui doit être terminée")
                        .setAutocomplete(true)
                        .setRequired(true)
                )
                .addStringOption((option: SlashCommandStringOption) =>
                    option
                        .setName("winner")
                        .setDescription("Le choix gagnant de la prédiction")
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        ),
    modal: false,
    subcommands: new Collection<string, Subcommand>()
        .set("start", { modal: true })
        .set("stop", { modal: false }),
    async autocomplete(interaction: AutocompleteInteraction, client?: ExtendedClient): Promise<void> {
        let ret: Array<ApplicationCommandOptionChoiceData<string | number>> = new Array<ApplicationCommandOptionChoiceData<string | number>>();
        let predectionId: string = interaction.options.getString("prediction", true);

        if (predectionId === "") {
            client?.predictions.forEach((prediction: Prediction, key: string) => {
                ret.push({
                    name: prediction.getQuestion(),
                    value: key
                });
            });
        } else {
            const prediction: Prediction = client?.predictions.get(predectionId)!;

            prediction.getChoices().forEach((choice: Choice, key: number) => {
                ret.push({
                    name: choice.name,
                    value: key.toString()
                });
            });
        }

        interaction.respond(ret);
    },
    async execute(interaction: ChatInputCommandInteraction<"cached">, client?: ExtendedClient): Promise<void> {
        switch (interaction.options.getSubcommand()) {
            case "start":
                await start(interaction);
                break;
            case "stop":
                await stop(interaction, client!);
                break;
        }
    }
}

export default command;

const start = async (interaction: ChatInputCommandInteraction<"cached">): Promise<void> => {
    const timer: number = interaction.options.getInteger("timer", true);
    const modal: ModalBuilder = new ModalBuilder()
        .setCustomId(`prediction-${timer}`)
        .setTitle("Prédiction");

    const question: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("question")
                .setLabel("Question")
                .setPlaceholder("C'est une question")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
        );

    const choice1: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("choice-1")
                .setLabel("Choix 1")
                .setPlaceholder("Oui")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
        );

    const choice2: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("choice-2")
                .setLabel("Choix 2")
                .setPlaceholder("Non")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
        );

    const choice3: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("choice-3")
                .setLabel("Choix 3")
                .setPlaceholder("Peut-être")
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
        );

    const choice4: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("choice-4")
                .setLabel("Choix 4")
                .setPlaceholder("Hummm")
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
        );

    modal.addComponents(question, choice1, choice2, choice3, choice4);

    await interaction.showModal(modal);
}

const stop = async (interaction: ChatInputCommandInteraction<"cached">, client: ExtendedClient): Promise<void> => {
    const predictionId: string = interaction.options.getString("prediction", true);
    const winner: string = interaction.options.getString("winner", true);
    const prediction: Prediction = client.predictions.get(predictionId)!;

    prediction.stop(parseInt(winner));

    await interaction.followUp({ content: "Prédiction terminée", ephemeral: true});
}