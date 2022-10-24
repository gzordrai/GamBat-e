import { Client, VoiceState } from "discord.js";
import { CooldownType, User } from "../database";

export default (client: Client): void => {
    client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
        const user: User = await new User(oldState.member?.id!).create();

        // Voice connection
        if(oldState.channelId === null)
            user.setCooldown(CooldownType.Vocal);
        else if(newState.channelId === null) { // Voice disconnection
            const minutes: number = (await user.getCooldown(CooldownType.Vocal)).getMinutes();
            const points: number = minutes * parseFloat(process.env.MINUTE_POINTS!);

            user.addPoints(points);
        }
    });
}; 