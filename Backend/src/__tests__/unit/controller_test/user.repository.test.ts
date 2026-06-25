import { UserMongoRepository } from "../../../repository/user.repository"

describe (
    "Unit Test:UserMongoRepository",
    ()=>{
        let userRepository=new UserMongoRepository();
         const testUser:any = {
        fullname: 'Test',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'customer',
        phoneNumber: '9800000000'
    }
    test(
        'should create a new user',
        async()=>{
            const createdUser=await userRepository.createUser(testUser);
            expect(createdUser).toBeDefined();
            expect(createdUser).toHaveProperty('_id');
            expect(createdUser.username).toBe(testUser.username);
            expect(createdUser.email).toBe(testUser.email);
        }
    )
    }
)