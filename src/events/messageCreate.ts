import { Events, Message } from "discord.js";
import { Event, ExtendedClient } from "../bot";
import { Cooldowns, User } from "../database/models/user.model";

const event: Event = {
    name: Events.MessageCreate,
    once: false,
    async execute(client: ExtendedClient, message: Message): Promise<void> {
        if (message.author.bot) return;

        const user = await User.findOneOrCreate({ id: message.author.id }, { id: message.author.id });

        if (user.cooldowns.message.getTime() + parseInt(process.env.MESSAGE_COOLDOWN!) > Date.now()) return;

        await user.addToBalance(parseInt(process.env.MESSAGE_REWARD!));
        await user.resetCooldown(Cooldowns.MESSAGE);
    },
};

export default event;