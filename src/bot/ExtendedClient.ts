import { Client, ClientOptions, Collection, GatewayIntentBits, Partials  } from "discord.js";
import { Prediction } from "../database";

export class ExtendedClient extends Client {
    public predictions: Collection<number, Prediction> = new Collection<number, Prediction>();

    public constructor(options: ClientOptions) {
        super(options);
    }
}