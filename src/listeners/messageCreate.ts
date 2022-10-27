import { Message } from "discord.js";
import { CooldownType } from "../utils/cooldowns";
import { User } from "../database";

export const messageCreate = async (message: Message): Promise<void> => {
    if(message.author.bot) return;

    const user: User = await new User(message.author.id).create();

    if((await user.getCooldown(CooldownType.Message)).isFinished(parseInt(process.env.MESSAGE_COOLDOWN!))) {
        await user.addPoints(parseInt(process.env.MESSAGE_POINTS!));
        await user.setCooldown(CooldownType.Message);
    }
}