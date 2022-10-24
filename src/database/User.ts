import { Cooldown } from "./Cooldown";
import { Database } from "./Database";
import { IUser } from "./IUser";
import { CooldownType } from "./CooldownType";

export class User extends Database {
    private static model: IUser = { points: 0, cooldowns: { message: 0, vocal: 0 } };
    private id: string;
    private path: string;

    public constructor(id: string) {
        super();
        this.id = id;
        this.path = `/users/${this.id}`;
    }

    /**
     * Check if the user is registered in the database
     * 
     * @returns True if it is registered and false if not
     */
    private async isRegister(): Promise<boolean> {
        return await this.database.exists(this.path);
    }

    /**
     * Save user to database
     */
    private async register(): Promise<void> {
        await this.database.push(`${this.path}`, User.model, true);
    }

    /**
     * Wait for the user to be added to the database
     * 
     * @returns The current user
     */
    public async create(): Promise<User> {
        if(!(await this.isRegister()))
            await this.register();
        
        return this;
    }

    /**
     * Adds x points to the user
     * 
     * @param x The number of points added
     */
    public async addPoints(x: number): Promise<void> {
        const points: number = parseFloat(await this.database.getData(`${this.path}/points`));

        await this.database.push(`${this.path}/points`, points + x, true);
    }

    /**
     * The number of points of the user
     * 
     * @returns User points
     */
    public async getPoints(): Promise<number> {
        return await this.database.getData(`${this.path}/points`);
    }

    /**
     * Set the user's cooldown timestamp
     * 
     * @param type The type of cooldown
     */
    public async setCooldown(type: CooldownType): Promise<void> {
        await this.database.push(`${this.path}/cooldowns/${type}`, Date.now(), true);
    }

    /**
     * The user's cooldown timestamp
     * 
     * @param type The type of cooldown
     * @returns The cooldown timestamp
     */
    public async getCooldown(type: CooldownType): Promise<Cooldown> {
        const cooldown: number = await this.database.getData(`${this.path}/cooldowns/${type}`);

        return new Cooldown(cooldown);
    }
}