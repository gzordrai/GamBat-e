import { Events, VoiceState } from "discord.js";
import { Event, ExtendedClient } from "../bot";
import { Cooldowns, User } from "../database/models/user.model";

const event: Event = {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(_: ExtendedClient, oldState: VoiceState, newState: VoiceState): Promise<void> {
        // Voice connection
        if(oldState.channelId === null) {
            const user = await User.findOneOrCreate({ id: newState.member?.id! }, { id: newState.member?.id! });

            await user.resetCooldown(Cooldowns.VOCAL);
        } else if(newState.channelId === null) { // Voice disconnection
            const user = await User.findOneOrCreate({ id: oldState.member?.id! }, { id: oldState.member?.id! });
            const minutes: number = (Date.now() - user.cooldowns.vocal.getTime()) / 1000 / 60;
            const reward: number = Math.floor(minutes * parseFloat(process.env.VOCAL_REWARD!));

            await user.addToBalance(reward);
        }
    },
};

export default event;