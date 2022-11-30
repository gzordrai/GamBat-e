import { Collection } from "discord.js";
import { JSONCooldown, JSONUser } from "../JSON";
import { Balance } from "./Balance";
import { Cooldown } from "./Cooldown";

export class User {
    private id: string;
    private balance: Balance;
    private cooldowns: Collection<string, Cooldown>;

    public constructor(id: string, balance: Balance, cooldowns: Collection<string, Cooldown>) {
        this.id = id;
        this.balance = balance;
        this.cooldowns = cooldowns;
    }

    /**
     * The balance of the user
     * 
     * @returns user balance
     */
    public getBalance(): Balance {
        return this.balance;
    }

    /**
     * The cooldowns of the user
     * 
     * @returns user cooldowns
     */
    public getCooldowns(): Collection<string, Cooldown> {
        return this.cooldowns;
    }

    /**
     * The id of the user
     * 
     * @returns user id
     */
    public getId(): string {
        return this.id;
    }

    /**
     * The data of the user intended to be stored in a .json
     * 
     * @returns user data
     */
    public toJSON(): JSONUser {
        let cooldowns: JSONCooldown = {};

        for(const cooldown of this.cooldowns.values())
            cooldowns[cooldown.getName()] = cooldown.getStart();

        return { balance: this.balance.get(), cooldowns: cooldowns };
    }
}