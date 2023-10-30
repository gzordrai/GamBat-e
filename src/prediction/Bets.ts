export interface Bet {
    userId: string;
    username: string;
    amount: number;
    choice: number;
}

export type Bets = Array<Bet>;