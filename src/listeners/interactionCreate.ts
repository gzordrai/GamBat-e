// import { CommandInteraction, Interaction, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalSubmitInteraction } from "discord.js";
// import { Prediction } from "../database/predictions/Prediction";
// import { commands } from "../bot/commands";
// import { ICommand } from "../bot/ICommand";
// import { ExtendedClient } from "src/bot/ExtendedClient";
// import { ChoiceType } from "../database/predictions/ChoiceType";
// import { User } from "../database/users/User";

// export const interactionCreate = async (client: ExtendedClient, interaction: Interaction): Promise<void> => {
//     if (interaction.isCommand())
//         await handleSlashCommand(client, interaction);
//     else if(interaction.isButton())
//         await handleButton(client, interaction);
//     else if(interaction.isModalSubmit())
//         await handleModalSubmit(client, interaction);
// }

// const handleSlashCommand = async (client: ExtendedClient, interaction: CommandInteraction): Promise<void> => {
//     const slashCommand: ICommand | undefined = commands.find((c: ICommand) => c.name === interaction.commandName);

//     if (!slashCommand)
//         interaction.followUp({ content: "An error has occurred" });
//     else {
//         await interaction.deferReply();
//         slashCommand.run(client, interaction);
//     }
// }

// const handleButton = async (client: ExtendedClient, interaction: ButtonInteraction): Promise<void> => {
//     if(interaction.customId.startsWith("prediction-")) {
//         const user: User = await new User(interaction.user.id).create();

//         const modal: ModalBuilder = new ModalBuilder()
//             .setCustomId(`modal-${interaction.customId}`)
//             .setTitle(`Mise de la prédiction`);
//         const betField: TextInputBuilder = new TextInputBuilder()
//             .setCustomId("bet")
//             .setLabel(`Combien voulez vous miser ? (${await user.getPoints()} pts)`)
//             .setStyle(TextInputStyle.Short)
//             .setRequired(true);
//         const row: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
//             .addComponents(betField);
        
//         modal.addComponents(row);

//         await interaction.showModal(modal);
//     }
// }

// const handleModalSubmit = async (client: ExtendedClient, interaction: ModalSubmitInteraction): Promise<void> => {
//     if(interaction.customId.startsWith("modal-prediction-")) {
//         const parsedCustomId: Array<string> = interaction.customId.split('-');
//         const predictionId: number = parseInt(parsedCustomId[2])
//         const choice: ChoiceType = parsedCustomId[3] === '1' ? ChoiceType.choiceOne : ChoiceType.choiceTwo;
//         const bet: number = parseInt(interaction.fields.getTextInputValue("bet"));
//         const user: User = await new User(interaction.user.id).create();
//         const prediction: Prediction = client.predictions.get(predictionId)!;

//         if(isNaN(bet) || bet <= 0)
//             await interaction.reply({ content: "Merci de bien vouloir rentrer une mise correct !", ephemeral: true });
//         else if((await user.getPoints()) < bet)
//             await interaction.reply({ content: "Vous n'avez pas assez de points !", ephemeral: true });
//         else {
//             let oppositeChoice: ChoiceType = choice === 1 ? ChoiceType.choiceTwo : ChoiceType.choiceOne

//             if(prediction.getUsers(oppositeChoice).has(interaction.user.id))
//                 await interaction.reply({ content: "Vous avez déjà parié pour le choix opposé !", ephemeral: true });
//             else {
//                 prediction.addPoints(choice, bet);
//                 prediction.addUser(choice, user);
//                 await user.addPoints(-bet);
//                 await interaction.reply({ content: `Vous avez parié ${bet} points !`, ephemeral: true });
//                 await prediction.updateEmbed();
//             }
//         }
//     }
// }