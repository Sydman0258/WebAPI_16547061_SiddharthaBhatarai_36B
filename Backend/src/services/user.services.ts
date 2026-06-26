import { email } from "zod";
import { createUserDTO, loginUserDTO, updateUserDTO } from "../dtos/user.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { UserMongoRepository } from "../repository/user.repository";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { CLIENT_URL, JWT_KEY } from "../config/constant";
import { sendEmail } from "../utils/email";

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
        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            username: user.username,
            role: user.role
        };
        return { token, user: userResponse };
    }

    async updateUser(id: string, updateData: updateUserDTO) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new HttpException(404, "user not found");
        }
        if (updateData.email && updateData.email !== user.email) {
            const existingUserByEmail = await userRepository.findbyEmail(updateData.email);
            if (existingUserByEmail) {
                throw new HttpException(400, "Email already exists");
            }
        }
        if (updateData.username && updateData.username !== user.username) {
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


    async sendResetPasswordEmail(email?: string) {
        if (!email) {
            throw new HttpException(400, "Email is required");
        }
        const user = await userRepository.findbyEmail(email);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        const token = jwt.sign({ id: user._id }, JWT_KEY, { expiresIn: '1h' }); // 1 hour expiry
        const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
        const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
        await sendEmail(user.email, "Password Reset", html);
        return {user,token};

    }

    async resetPassword(token?: string, newPassword?: string) {
        try {
            if (!token || !newPassword) {
                throw new HttpException(400, "Token and new password are required");
            }
            const decoded: any = jwt.verify(token, JWT_KEY);
            const userId = decoded.id;
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new HttpException(404, "User not found");
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userRepository.update(userId, { password: hashedPassword });
            return user;
        } catch (error) {
            throw new HttpException(400, "Invalid or expired token");
        }
    }
}