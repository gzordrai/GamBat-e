import { EmbedBuilder, Message } from "discord.js";
import { Choice, Choices } from "./Choices";
import { Bet, Bets } from "./Bets";
import { User } from "../database/models/user.model";
import { updateRoles } from "../utils";

/**
 * Represents a prediction with multiple choices and bets.
 */
export class Prediction {
    private message: Message | null;
    private timer: number;
    private question: string;
    private choices: Choices;
    private bets: Bets;

    public constructor(timer: number) {
        this.message = null;
        this.timer = timer;
        this.question = "";
        this.choices = [];
        this.bets = [];
    }

    /**
     * Starts the prediction.
     * 
     * This method starts an interval that updates the prediction message every 5 seconds.
     * After a specified amount of time (this.timer), it stops updating the message and removes any components.
     */
    public async start(): Promise<void> {
        const interaval = setInterval(() => {
            if (this.message)
                this.message.edit({ embeds: [this.createEmbed()] });
        }, 5000);

        setTimeout(() => {
            clearInterval(interaval);

            if (this.message)
                this.message.edit({ embeds: [this.createEmbed()], components: [] });
        }, this.timer * 1000);
    }

    /**
     * Stops the prediction for a specific choice.
     * 
     * @param id The id of the choice to stop the prediction for.
     * 
     * This method goes through all the bets and if the bet choice matches the provided id,
     * it finds the user and adds to their balance. It also updates the user's roles.
     */
    public async stop(id: number): Promise<void> {
        Promise.all(
            this.bets.map(async (bet: Bet) => {
                if (bet.choice !== id) return;

                const user = await User.findOne({ id: bet.userId });

                if (user) {
                    await user.addToBalance(Math.floor(bet.amount * 1.25));
                    await updateRoles(this.message!.guild!.members.cache.get(user.id)!);
                }
            })
        );
    }

    /**
     * Adds a choice to the prediction.
     * 
     * @param choice The choice to be added.
     * 
     * This method adds a new choice to the list of choices for the prediction.
     */
    public addChoice(choice: Choice): void {
        this.choices.push(choice);
    }

    /**
     * Adds a bet to the prediction.
     * 
     * @param bet The bet to be added.
     * 
     * If a bet from the same user already exists, it increases the amount of the existing bet.
     * Otherwise, it adds the bet to the list of bets.
     */
    public addBet(bet: Bet): void {
        let userBet: Bets = this.bets.filter((b: Bet) => b.userId === bet.userId && b.choice === bet.choice);

        if (userBet.length > 0)
            userBet[0].amount += bet.amount;
        else
            this.bets.push(bet);
    }

    /**
     * Sets the message for the prediction.
     * 
     * @param message The message to be set.
     */
    public setMessage(message: Message): void {
        this.message = message;
    }

    /**
     * Sets the question for the prediction.
     * 
     * @param question The question to be set.
     */
    public setQuestion(question: string): void {
        this.question = question;
    }

    /**
     * Gets the choices for the prediction.
     * 
     * @returns The choices of the prediction.
     */
    public getChoices(): Choices {
        return this.choices;
    }

    /**
     * Gets the question for the prediction.
     * 
     * @returns The question of the prediction.
     */
    public getQuestion(): string {
        return this.question;
    }

    /**
     * Creates an embed for the prediction.
     * 
     * @returns An EmbedBuilder instance representing the prediction.
     * 
     * The embed includes the prediction question as the title, and one field for each choice.
     * Each field contains the name of the choice and a list of bets for that choice.
     * If no bets have been made for a choice, the field value is "Aucun pari".
     */
    public createEmbed(): EmbedBuilder {
        const embed: EmbedBuilder = new EmbedBuilder();

        embed.setTitle(this.question);

        for (const choice of this.choices) {
            const bets = this.bets.filter((bet: Bet) => bet.choice === choice.id).map((bet: Bet) => `${bet.username}: ${bet.amount}`);

            embed.addFields({
                name: choice.name,
                value: bets.length > 0 ? bets.join('\n') : "Aucun pari",
                inline: true
            });
        }

        return embed;
    }
}