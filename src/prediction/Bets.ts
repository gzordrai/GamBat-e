export interface Bet {
    userId: string;
    amount: number;
    choice: number;
}

export type Bets = Array<Bet>;