import { email } from "zod";
import { createUserDTO, loginUserDTO, updateUserDTO } from "../dtos/user.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { UserMongoRepository } from "../repository/user.repository";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/constant";

const userRepository = new UserMongoRepository();

export class userService {
    async createUser(userData: createUserDTO) {
        const existingUserbyUsername = await userRepository.findUsername(userData.username);
        const existingUserbyEmail = await userRepository.findbyEmail(userData.email);
        if (existingUserbyUsername) {
            throw new HttpException(400, "Username already exists");
        }
        if (existingUserbyEmail) {
            throw new HttpException(400, "Email already exista");
        }

        const hashPassword = await bcrypt.hash(userData.password, 12);
        const userToCreate = {
            ...userData, password: hashPassword
        };
        const createdUser = await userRepository.createUser(userToCreate as any);
        return createdUser;
    }

    async loginUser(loginData: loginUserDTO) {
        const user = await userRepository.findbyEmail(loginData.email);

        if (!user) {
            throw new HttpException(400, "User Not Found");
        }
        const isPasswordValid = await bcrypt.compare(
            loginData.password,
            user.password
        );
        if (!isPasswordValid) {
            throw new HttpException(400, "Password invalid");
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_KEY,
            { expiresIn: "300m" }
        );
        return{token,user};
    }

    async updateUser(id: string, updateData: updateUserDTO) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new HttpException(404, "user not found");
        }
        if(updateData.email && updateData.email !== user.email) {
            const existingUserByEmail = await userRepository.findbyEmail(updateData.email);
            if (existingUserByEmail) {
                throw new HttpException(400, "Email already exists");
            }
        }
        if(updateData.username && updateData.username !== user.username) {
            const existingUserByUsername = await userRepository.findUsername(updateData.username);
            if (existingUserByUsername) {
                throw new HttpException(400, "Username already exists");
            }
        }
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const updatedUser = await userRepository.update(id, updateData);
        return updatedUser;
    }
}