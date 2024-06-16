import { BaseCommand } from "azuria";

export interface IBotConfig {
    channelGenerator: {
        channels: {
            commun: Array<string>;
            rare: Array<string>;
            epic: Array<string>;
            legendary: Array<string>;
        }
        rarities: {
            commun: number;
            rare: number;
            epic: number;
            legendary: number;
        };
        excludedChannelIds: string[];
        generatorChannelId: string;
    };
}

export type Command = BaseCommand<IBotConfig>;