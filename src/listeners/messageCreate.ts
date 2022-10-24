import { Client, Message } from "discord.js";
import { CooldownType, User } from "../database";

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        const user: User = await new User(message.author.id).create();

        if((await user.getCooldown(CooldownType.Message)).isFinished(parseInt(process.env.MESSAGE_COOLDOWN!))) {
            user.addPoints(parseInt(process.env.MESSAGE_POINTS!));
            user.setCooldown(CooldownType.Message);
        }
    });
}; 