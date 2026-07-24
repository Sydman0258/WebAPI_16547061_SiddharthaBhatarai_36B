import User from "../../../models/user.model";
import { UserMongoRepository } from "../../../repository/user.repository";

describe("UserMongoRepository", () => {

    const userRepository = new UserMongoRepository();

    beforeEach(async () => {
        await User.deleteMany({});
    });


    const createTestUser = () => ({
        fullname: "Test User",
        email: `test${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: "password123",
        confirmPassword: "password123",
        role: "customer",
        phoneNumber: "9800000000"
    });


    test("should create a new user", async () => {

        const user = await userRepository.createUser(
            createTestUser() as any
        );

        expect(user).toBeDefined();
        expect(user.email).toContain("@example.com");

    });


    test("should find user by id", async () => {

        const created = await userRepository.createUser(
            createTestUser() as any
        );


        const found = await userRepository.findById(
            created._id.toString()
        );


        expect(found).not.toBeNull();
        expect(found?._id.toString())
            .toBe(created._id.toString());

    });


    test("should find all users", async () => {

        await userRepository.createUser(
            createTestUser() as any
        );


        const users = await userRepository.findAll();


        expect(users.length).toBe(1);

    });



    test("should find user by email", async () => {

        const created = await userRepository.createUser(
            createTestUser() as any
        );


        const found =
            await userRepository.findbyEmail(created.email);


        expect(found).not.toBeNull();
        expect(found?.email)
            .toBe(created.email);

    });



    test("should find user by username", async () => {

        const created = await userRepository.createUser(
            createTestUser() as any
        );


        const found =
            await userRepository.findUsername(created.username);


        expect(found).not.toBeNull();
        expect(found?.username)
            .toBe(created.username);

    });



    test("should update user", async () => {

        const created = await userRepository.createUser(
            createTestUser() as any
        );


        const updated =
            await userRepository.update(
                created._id.toString(),
                {
                    fullname:"Updated Name"
                }
            );


        expect(updated).not.toBeNull();
        expect(updated?.fullname)
            .toBe("Updated Name");

    });



    test("should delete user", async () => {

        const created = await userRepository.createUser(
            createTestUser() as any
        );


        const deleted =
            await userRepository.delete(
                created._id.toString()
            );


        expect(deleted).toBe(true);


        const found =
            await User.findById(created._id);


        expect(found).toBeNull();

    });



    test("should get paginated users without search", async () => {

        await userRepository.createUser(
            createTestUser() as any
        );


        const result =
            await userRepository.getAllPaginated(
                1,
                10
            );


        expect(result.data.length)
            .toBe(1);

        expect(result.total)
            .toBe(1);

    });



    test("should get paginated users with search", async () => {

        await userRepository.createUser({
            fullname:"John",
            email:"john@test.com",
            username:"john123",
            password:"password123",
            confirmPassword:"password123",
            role:"customer",
            phoneNumber:"9800000000"
        } as any);



        const result =
            await userRepository.getAllPaginated(
                1,
                10,
                "john"
            );


        expect(result.total)
            .toBe(1);

        expect(result.data[0].username)
            .toBe("john123");

    });


});