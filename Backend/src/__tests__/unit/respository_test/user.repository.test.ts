import User, { IUser } from "../../../models/user.model";
import { UserMongoRepository } from "../../../repository/user.repository";

describe("UserMongoRepository", () => {
    const userRepository = new UserMongoRepository();

    beforeEach(async () => {
        await User.deleteMany({});
    });

    test("should create a new user", async () => {

        const testUser = {
            fullname: "Test",
            email: `test${Date.now()}@example.com`,
            username: `testuser${Date.now()}`,
            password: "password123",
            confirmPassword: "password123",
            role: "customer",
            phoneNumber: "9800000000"
        };

const createdUser = await userRepository.createUser(testUser as any);
        expect(createdUser).toBeDefined();
        expect(createdUser).toHaveProperty("_id");
        expect(createdUser.username).toBe(testUser.username);
        expect(createdUser.email).toBe(testUser.email);
    });
});