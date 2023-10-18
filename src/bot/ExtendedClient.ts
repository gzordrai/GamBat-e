import { Client, Collection } from "discord.js";
import { Command } from "./Command";
import { Prediction } from "../prediction";

export class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection<string, Command>();
    public predictions: Collection<string, Prediction> = new Collection<string, Prediction>();
}