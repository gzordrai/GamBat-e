import { REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { config } from "dotenv";
import { readdirSync } from "fs";
import path from "path";
import { Command } from "./bot";

config({ path: path.join(__dirname, "../.env") });

const rest: REST = new REST({ version: '10' }).setToken(process.env.TOKEN!);
const commands: Array<RESTPostAPIApplicationCommandsJSONBody> = new Array<RESTPostAPIApplicationCommandsJSONBody>();
const commandFiles: Array<string> = readdirSync(path.join(__dirname, "./commands")).filter((file: string) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command: Command = require(path.join(__dirname, `./commands/${file}`)).default;
    commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data: any = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();