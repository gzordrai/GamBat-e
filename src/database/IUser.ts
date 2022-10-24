export interface IUser {
    points: number;
    cooldowns: {
        message: number;
        vocal: number;
    }
}