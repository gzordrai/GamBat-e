export interface Choice {
    id: number;
    name: string;
    odds: number;
}

export type Choices = Array<Choice>;