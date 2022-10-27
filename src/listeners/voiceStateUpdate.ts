import { VoiceState } from "discord.js";
import { CooldownType } from "../utils/cooldowns";
import { User } from "../database";

export const voiceStateUpdate = async (oldState: VoiceState, newState: VoiceState): Promise<void> => {
    const user: User = await new User(oldState.member?.id!).create();

    // Voice connection
    if(oldState.channelId === null)
        await user.setCooldown(CooldownType.Vocal);
    else if(newState.channelId === null) { // Voice disconnection
        const minutes: number = (await user.getCooldown(CooldownType.Vocal)).getMinutes();
        const points: number = minutes * parseFloat(process.env.MINUTE_POINTS!);

        await user.addPoints(points);
    }
}