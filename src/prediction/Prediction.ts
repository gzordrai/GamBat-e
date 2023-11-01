import { EmbedBuilder, Message } from "discord.js";
import { Choice, Choices } from "./Choices";
import { Bet, Bets } from "./Bets";
import { User } from "../database/models/user.model";
import { updateRoles } from "../utils";

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

    public async start() {
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

    public async stop(id: number) {
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

    public addChoice(choice: Choice): void {
        this.choices.push(choice);
    }

    public getChoices(): Choices {
        return this.choices;
    }

    public setMessage(message: Message): void {
        this.message = message;
    }

    public setQuestion(question: string): void {
        this.question = question;
    }

    public getQuestion(): string {
        return this.question;
    }

    public addBet(bet: Bet): void {
        let userBet: Bets = this.bets.filter((b: Bet) => b.userId === bet.userId && b.choice === bet.choice);
        
        if (userBet.length > 0)
            userBet[0].amount += bet.amount;
        else
            this.bets.push(bet);
    }

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