import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { User, IUser } from "../../../src/database/models/user.model";
import { InsufficientBalanceError } from "../../../src/database/errors";

describe("User Model", () => {
    beforeEach(async () => {
        await User.deleteMany({ id: "123456" });
    });

    it("should create a new user", async () => {
        const user = new User({
            id: "123456",
            balance: 100,
        });

        await user.save();

        const result: IUser | null = await User.findOne({ id: "123456" });

        expect(result).to.exist;
        expect(result?.id).to.equal("123456");
        expect(result?.balance).to.equal(100);
    });

    it("should add to user balance", async () => {
        const user = new User({
            id: "123456",
            balance: 100,
        });

        await user.save();
        await user.addToBalance(50);

        const result: IUser | null = await User.findOne({ id: "123456" });

        expect(result?.balance).to.equal(150);
    });

    it("should subtract from user balance", async () => {
        const user = new User({
            id: "123456",
            balance: 100,
        });

        await user.save();
        await user.subsFromBalance(50);

        const result: IUser | null = await User.findOne({ id: "123456" });

        expect(result?.balance).to.equal(50);
    });

    it("should check if user has enough balance", async () => {
        const user = new User({
            id: "123456",
            balance: 100,
        });

        await user.save();

        const hasEnoughBalance: boolean = await user.has(50);

        expect(hasEnoughBalance).to.be.true;

        const hasNotEnoughBalance: boolean = await user.has(150);

        expect(hasNotEnoughBalance).to.be.false;
    });

    it("should throw InsufficientBalanceError when user does not have enough balance", async () => {
        const user = new User({
            id: "123456",
            balance: 100,
        });

        await user.save();

        try {
            await user.subsFromBalance(150);

            assert.fail("Expected InsufficientBalanceError to be thrown");
        } catch (err: unknown) {
            expect(err).to.be.instanceOf(InsufficientBalanceError);
            expect((err as InsufficientBalanceError).message).to.equal("User does not have enough balance");
        }
    });

    it("should find or create a user", async () => {
        const user = await User.findOneOrCreate(
            { id: "123456" },
            { id: "123456", balance: 100 }
        );

        expect(user).to.exist;
        expect(user.id).to.equal("123456");
        expect(user.balance).to.equal(100);
    });
});
