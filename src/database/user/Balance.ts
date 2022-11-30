export class Balance {
    private amount: number;

    public constructor(amount: number) {
        this.amount = amount;
    }

    /**
     * Add a value to the total balance amount
     * 
     * @param x the value that will be added
     */
    public add(x: number): void {
        this.amount += x;
    }

    /**
     * Check if the balance contains a certain amount
     * 
     * @param x the amount to check
     * @returns true if the balance contains contains the given amount otherwise false
     */
    public has(x: number): boolean {
        return this.amount >= x;
    }

    /**
     * The total balance amount
     * 
     * @returns balance amount
     */
    public get(): number {
        return this.amount;
    }
}