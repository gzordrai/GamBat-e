import { JSONCooldown } from "./JSONCooldown";

export interface JSONUser {
    balance: number;
    cooldowns: JSONCooldown;
}