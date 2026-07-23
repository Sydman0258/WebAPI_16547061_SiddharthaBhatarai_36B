import { userService } from "../../../services/user.services";
import { UserMongoRepository } from "../../../repository/user.repository";
import { HttpException } from "../../../exceptions/http-exceptions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../utils/email";

jest.mock("../../../repository/user.repository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../utils/email");

describe("userService", () => {
  let service: userService;

  beforeEach(() => {
    service = new userService();
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    const mockUserData = {
      username: "johndoe",
      email: "john@example.com",
      password: "plainPassword123",
      fullname: "John Doe",
      role: "customer",
    };

    it("should successfully hash password and create a new user", async () => {
      (UserMongoRepository.prototype.findUsername as jest.Mock).mockResolvedValue(null);
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");
      (UserMongoRepository.prototype.createUser as jest.Mock).mockResolvedValue({
        _id: "user123",
        ...mockUserData,
        password: "hashedPassword123",
      });

      const result = await service.createUser(mockUserData as any);

      expect(UserMongoRepository.prototype.findUsername).toHaveBeenCalledWith("johndoe");
      expect(UserMongoRepository.prototype.findbyEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("plainPassword123", 12);
      expect(UserMongoRepository.prototype.createUser).toHaveBeenCalledWith({
        ...mockUserData,
        password: "hashedPassword123",
      });
      expect(result._id).toBe("user123");
    });

    it("should throw 400 error if username already exists", async () => {
      (UserMongoRepository.prototype.findUsername as jest.Mock).mockResolvedValue({ id: "existing" });

      await expect(service.createUser(mockUserData as any)).rejects.toThrow(HttpException);
      await expect(service.createUser(mockUserData as any)).rejects.toMatchObject({
        status: 400,
        message: "Username already exists",
      });
    });

    it("should throw 400 error if email already exists", async () => {
      (UserMongoRepository.prototype.findUsername as jest.Mock).mockResolvedValue(null);
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue({ id: "existing" });

      await expect(service.createUser(mockUserData as any)).rejects.toThrow(HttpException);
      await expect(service.createUser(mockUserData as any)).rejects.toMatchObject({
        status: 400,
        message: "Email already exista",
      });
    });
  });

  describe("loginUser", () => {
    const loginPayload = { email: "john@example.com", password: "plainPassword123" };
    const mockUser = {
      _id: "user123",
      fullname: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      password: "hashedPassword123",
      role: "customer",
    };

    it("should verify credentials and return token along with user payload", async () => {
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mocked-jwt-token");

      const result = await service.loginUser(loginPayload as any);

      expect(UserMongoRepository.prototype.findbyEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("plainPassword123", "hashedPassword123");
      expect(result).toEqual({
        token: "mocked-jwt-token",
        user: {
          _id: "user123",
          fullname: "John Doe",
          email: "john@example.com",
          username: "johndoe",
          role: "customer",
        },
      });
    });

    it("should throw 400 error if user email is not found", async () => {
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.loginUser(loginPayload as any)).rejects.toMatchObject({
        status: 400,
        message: "User Not Found",
      });
    });

    it("should throw 400 error if password does not match", async () => {
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.loginUser(loginPayload as any)).rejects.toMatchObject({
        status: 400,
        message: "Password invalid",
      });
    });
  });

  describe("updateUser", () => {
    const existingUser = {
      _id: "user123",
      email: "old@example.com",
      username: "oldusername",
    };

    it("should update user information successfully", async () => {
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue(existingUser);
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue(null);
      (UserMongoRepository.prototype.findUsername as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
      (UserMongoRepository.prototype.update as jest.Mock).mockResolvedValue({
        _id: "user123",
        email: "new@example.com",
      });

      const updatePayload = {
        email: "new@example.com",
        username: "newusername",
        password: "newPassword123",
      };

      const result = await service.updateUser("user123", updatePayload as any);

      expect(UserMongoRepository.prototype.findById).toHaveBeenCalledWith("user123");
      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
      expect(UserMongoRepository.prototype.update).toHaveBeenCalledWith("user123", {
        email: "new@example.com",
        username: "newusername",
        password: "newHashedPassword",
      });
      expect(result).toEqual({ _id: "user123", email: "new@example.com" });
    });

    it("should throw 404 if user to update does not exist", async () => {
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.updateUser("invalid-id", {})).rejects.toMatchObject({
        status: 404,
        message: "user not found",
      });
    });

    it("should throw 400 if updating to an email that is already taken", async () => {
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue(existingUser);
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue({ _id: "otherUser" });

      await expect(
        service.updateUser("user123", { email: "taken@example.com" } as any)
      ).rejects.toMatchObject({
        status: 400,
        message: "Email already exists",
      });
    });
  });

  describe("sendResetPasswordEmail", () => {
    it("should generate a reset token and trigger email delivery", async () => {
      const mockUser = { _id: "user123", email: "john@example.com" };
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("reset-jwt-token");
      (sendEmail as jest.Mock).mockResolvedValue(true);

      const result = await service.sendResetPasswordEmail("john@example.com");

      expect(jwt.sign).toHaveBeenCalledWith({ id: "user123" }, expect.any(String), {
        expiresIn: "1h",
      });
      expect(sendEmail).toHaveBeenCalledWith(
        "john@example.com",
        "Password Reset",
        expect.stringContaining("reset-password?token=reset-jwt-token")
      );
      expect(result).toEqual({ user: mockUser, token: "reset-jwt-token" });
    });

    it("should throw 400 if email is missing", async () => {
      await expect(service.sendResetPasswordEmail(undefined)).rejects.toMatchObject({
        status: 400,
        message: "Email is required",
      });
    });

    it("should throw 404 if user is not found by email", async () => {
      (UserMongoRepository.prototype.findbyEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.sendResetPasswordEmail("missing@example.com")).rejects.toMatchObject({
        status: 404,
        message: "User not found",
      });
    });
  });

  describe("resetPassword", () => {
    it("should decode token, hash new password, and update user record", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue({ _id: "user123" });
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword123");
      (UserMongoRepository.prototype.update as jest.Mock).mockResolvedValue({ _id: "user123" });

      const result = await service.resetPassword("valid-token", "myNewPassword123");

      expect(jwt.verify).toHaveBeenCalledWith("valid-token", expect.any(String));
      expect(bcrypt.hash).toHaveBeenCalledWith("myNewPassword123", 10);
      expect(UserMongoRepository.prototype.update).toHaveBeenCalledWith("user123", {
        password: "newHashedPassword123",
      });
      expect(result).toEqual({ _id: "user123" });
    });

    it("should catch invalid token or general errors and throw a 400 error", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt expired");
      });

      await expect(service.resetPassword("invalid-token", "newPassword")).rejects.toMatchObject({
        status: 400,
        message: "Invalid or expired token",
      });
    });
  });

  describe("getAllUserPaginated", () => {
    it("should return formatted data and pagination metadata with defaults", async () => {
      const mockResult = {
        data: [{ _id: "user1" }, { _id: "user2" }],
        total: 2,
      };
      (UserMongoRepository.prototype.getAllPaginated as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.getAllUserPaginated("1", "10", "john");

      expect(UserMongoRepository.prototype.getAllPaginated).toHaveBeenCalledWith(1, 10, "john");
      expect(result).toEqual({
        data: mockResult.data,
        pagination: {
          page: 1,
          limit: 10,
          totalPages: 1,
          total: 2,
        },
      });
    });

    it("should fallback to default page=1 and limit=10 when parameters are invalid", async () => {
      (UserMongoRepository.prototype.getAllPaginated as jest.Mock).mockResolvedValue({
        data: [],
        total: 0,
      });

      await service.getAllUserPaginated("-5", "abc", "");

      expect(UserMongoRepository.prototype.getAllPaginated).toHaveBeenCalledWith(1, 10, undefined);
    });
  });

  describe("checkPassword", () => {
    it("should return true when the current password matches", async () => {
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue({
        _id: "user123",
        password: "hashedPassword123",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const isValid = await service.checkPassword("user123", "secretPassword");

      expect(bcrypt.compare).toHaveBeenCalledWith("secretPassword", "hashedPassword123");
      expect(isValid).toBe(true);
    });

    it("should throw 400 if current password is wrong", async () => {
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue({
        _id: "user123",
        password: "hashedPassword123",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.checkPassword("user123", "wrongPassword")).rejects.toMatchObject({
        status: 400,
        message: "Current password is incorrect",
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete user if user exists", async () => {
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue({ _id: "user123" });
      (UserMongoRepository.prototype.delete as jest.Mock).mockResolvedValue(true);

      const result = await service.deleteUser("user123");

      expect(UserMongoRepository.prototype.delete).toHaveBeenCalledWith("user123");
      expect(result).toBe(true);
    });

    it("should throw 404 if user to delete does not exist", async () => {
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUser("missing123")).rejects.toMatchObject({
        status: 404,
        message: "User not found",
      });
    });
  });

  describe("getUserById", () => {
    it("should return user document if found", async () => {
      const mockUser = { _id: "user123", email: "john@example.com" };
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserById("user123");

      expect(result).toEqual(mockUser);
    });

    it("should throw 404 if user is not found", async () => {
      (UserMongoRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getUserById("missing123")).rejects.toMatchObject({
        status: 404,
        message: "User not found",
      });
    });
  });
});