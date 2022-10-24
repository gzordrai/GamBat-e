import { Client, Message } from "discord.js";
import { JsonDB } from "node-json-db";

export default (client: Client, database: JsonDB): void => {
    client.on("messageCreate", async (message: Message) => {
        const authorId: string = message.author.id;

        if(!(await database.exists(`/${authorId}`)))
            await database.push(`/${authorId}`, { points: 0, vocal: null }, true);

        await database.push(`/${authorId}/points`, await database.getData(`/${authorId}/points`) + parseFloat(process.env.MESSAGE_POINTS!), true);
    });
}; 