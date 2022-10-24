import { Client, VoiceState } from "discord.js";
import { JsonDB } from "node-json-db";

export default (client: Client, database: JsonDB): void => {
    client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
        const userId: string = oldState.member?.id!;

        if(!(await database.exists(`/${userId}`)))
            await database.push(`/${userId}`, { points: 0, vocal: null }, true);

        // Voice connection
        if(oldState.channelId === null) {
            await database.push(`/${userId}/vocal`, Date.now(), true);
        } else if (newState.channelId === null) { // Voice disconnection
            const start: number = await database.getData(`/${userId}/vocal`);
            const millis: number = Date.now() - start;
            const points: number = Math.floor(millis / 1000) * parseFloat(process.env.SECOND_MULTIPLIER!);

            console.log(Math.floor(millis / 1000), points);

            await database.push(`/${userId}/points`, await database.getData(`/${userId}/points`) + points, true);
        }
    });
}; 