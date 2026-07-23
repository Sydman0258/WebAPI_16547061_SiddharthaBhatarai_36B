import { UserController } from "../../../controllers/user.controller";
import { userService } from "../../../services/user.services";
import { ApiResponseHelper } from "../../../utils/api-response";
import { createUserDTO, loginUserDTO, updateUserDTO } from "../../../dtos/user.dtos";
import { Request, Response } from "express";

jest.mock("../../../services/user.services");
jest.mock("../../../utils/api-response");

jest.mock("../../../dtos/user.dtos", () => ({
  createUserDTO: { safeParse: jest.fn() },
  loginUserDTO: { safeParse: jest.fn() },
  updateUserDTO: { safeParse: jest.fn() },
}));

describe("UserController", () => {
  let userController: UserController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    userController = new UserController();
    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("createUser", () => {
    it("should successfully create a user and return 201", async () => {
      const mockUserData = { email: "test@example.com", name: "John Doe" };
      const mockCreatedUser = { id: "1", ...mockUserData };

      mockReq.body = mockUserData;
      (createUserDTO.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockUserData,
      });

      (userService.prototype.createUser as jest.Mock).mockResolvedValue(mockCreatedUser);

      await userController.createUser(mockReq as Request, mockRes as Response);

      expect(createUserDTO.safeParse).toHaveBeenCalledWith(mockUserData);
      expect(userService.prototype.createUser).toHaveBeenCalledWith(mockUserData);
      expect(ApiResponseHelper.success).toHaveBeenCalledWith(
        mockRes,
        mockCreatedUser,
        true,
        201,
        "Customer Created"
      );
    });

    it("should handle validation error when DTO fails", async () => {
      (createUserDTO.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { issues: [] },
      });

      await userController.createUser(mockReq as Request, mockRes as Response);

      expect(ApiResponseHelper.error).toHaveBeenCalledWith(
        mockRes,
        expect.any(String),
        400
      );
    });

    it("should handle service errors gracefully", async () => {
      (createUserDTO.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {},
      });

      (userService.prototype.createUser as jest.Mock).mockRejectedValue(
        new Error("Database connection failed")
      );

      await userController.createUser(mockReq as Request, mockRes as Response);

      expect(ApiResponseHelper.error).toHaveBeenCalledWith(
        mockRes,
        "Database connection failed",
        500
      );
    });
  });

  describe("loginUser", () => {
    it("should successfully login user and return token", async () => {
      const loginPayload = { email: "test@example.com", password: "password123" };
      const serviceResponse = { user: { id: "1", email: loginPayload.email }, token: "jwt-token" };

      mockReq.body = loginPayload;
      (loginUserDTO.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: loginPayload,
      });

      (userService.prototype.loginUser as jest.Mock).mockResolvedValue(serviceResponse);

      await userController.loginUser(mockReq as Request, mockRes as Response);

      expect(ApiResponseHelper.success).toHaveBeenCalledWith(
        mockRes,
        serviceResponse,
        true,
        200,
        "Login successful"
      );
    });

    it("should return error response when login validation fails", async () => {
      (loginUserDTO.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { issues: [] },
      });

      await userController.loginUser(mockReq as Request, mockRes as Response);

      expect(ApiResponseHelper.error).toHaveBeenCalledWith(mockRes, expect.any(String), 400);
    });
  });

  describe("updateUser", () => {
    it("should update user details along with file image path if uploaded", async () => {
      mockReq.user = { _id: "user123" };
      mockReq.body = { name: "Jane Doe" };
      mockReq.file = {
        filename: "avatar.jpg",
        destination: "/var/uploads/profiles",
      } as Express.Multer.File;

      (updateUserDTO.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: { name: "Jane Doe" },
      });

      const updatedResult = { id: "user123", name: "Jane Doe", imageUrl: "/uploads/profiles/avatar.jpg" };
      (userService.prototype.updateUser as jest.Mock).mockResolvedValue(updatedResult);

      await userController.updateUser(mockReq as Request, mockRes as Response);

      expect(userService.prototype.updateUser).toHaveBeenCalledWith("user123", {
        name: "Jane Doe",
        imageUrl: "/uploads/profiles/avatar.jpg",
      });
      expect(ApiResponseHelper.success).toHaveBeenCalledWith(mockRes, updatedResult, true, 200, "User updated");
    });
  });

  describe("getUser", () => {
    it("should return user info when authenticated user exists on req", async () => {
      const mockUser = { _id: "user123", email: "test@example.com" };
      mockReq.user = mockUser;

      await userController.getUser(mockReq as Request, mockRes as Response);

      expect(ApiResponseHelper.success).toHaveBeenCalledWith(mockRes, mockUser, true, 200, "User info retrieved");
    });

    it("should fail with 401 Unauthorized if user is missing on req", async () => {
      mockReq.user = undefined;

      await userController.getUser(mockReq as Request, mockRes as Response);

      expect(ApiResponseHelper.error).toHaveBeenCalledWith(mockRes, "Unauthorized", 401);
    });
  });

  describe("sendResetPasswordEmail", () => {
    it("should send reset password email successfully", async () => {
      mockReq.body = { email: "test@example.com" };
      (userService.prototype.sendResetPasswordEmail as jest.Mock).mockResolvedValue({ id: "1" });

      await userController.sendResetPasswordEmail(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { id: "1" },
        message: "If the email is registered, a reset link has been sent.",
      });
    });

    it("should return error status and message on failure", async () => {
      mockReq.body = { email: "test@example.com" };
      const customError = { statusCode: 404, message: "Email not found" };

      (userService.prototype.sendResetPasswordEmail as jest.Mock).mockRejectedValue(customError);

      await userController.sendResetPasswordEmail(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Email not found",
      });
    });
  });

  describe("resetPassword", () => {
    it("should successfully reset the password", async () => {
      mockReq.params = { token: "valid-token" };
      mockReq.body = { newPassword: "newSecretPassword123" };

      (userService.prototype.resetPassword as jest.Mock).mockResolvedValue(true);

      await userController.resetPassword(mockReq as Request, mockRes as Response);

      expect(userService.prototype.resetPassword).toHaveBeenCalledWith("valid-token", "newSecretPassword123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Password has been reset successfully.",
      });
    });
  });
});