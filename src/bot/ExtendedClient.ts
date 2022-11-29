import { Client, Collection } from "discord.js";
import { Command } from "./Command";

export class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection<string, Command>();
}