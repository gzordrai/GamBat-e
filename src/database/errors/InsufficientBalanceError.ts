export class InsufficientBalanceError extends Error {
    constructor() {
        super("User does not have enough balance");
        this.name = "InsufficientBalanceError";
    }
}