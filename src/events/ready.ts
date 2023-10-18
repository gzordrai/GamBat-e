import { Events } from "discord.js";
import { ExtendedClient, Event } from "../bot";

const event: Event = {
    name: Events.ClientReady,
    once: true,
    async execute(client: ExtendedClient): Promise<void> {
        if(!client.user || !client.application) return;

        console.log(`Logged in as ${client.user.tag} !`);
    },
};

export default event;