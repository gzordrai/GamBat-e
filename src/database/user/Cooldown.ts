export class Cooldown {
    private name: string;
    private start: number;

    public constructor(name: string, start: number) {
        this.name = name;
        this.start = start;
    }

    /**
     * The cooldown name
     * 
     * @returns cooldown name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * The start timestamp
     * 
     * @returns start timestamp
     */
    public getStart(): number {
        return this.start;
    }

    /**
     * The total number of seconds since the start timestamp
     * 
     * @returns number of seconds
     */
    private getSeconds(): number {
        return Math.floor((Date.now() - this.start) / 1000);
    }

    /**
     * Check if the cooldown is finished
     * 
     * @param x cooldown time
     * @returns true if the cooldown is complete otherwise false
     */
    public isFinished(duration: number): boolean {
        return this.getSeconds() >= duration;
    }

    /**
     * Reset the cooldown
     */
    public reset(): void {
        this.start = Date.now();
    }
}