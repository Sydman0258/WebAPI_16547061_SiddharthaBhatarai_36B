import { Request, Response } from "express";
import { DriverController } from "../../../controllers/driver.controllers";
import { DriverService } from "../../../services/driver.service";

jest.mock("../../../services/driver.service");
describe("DriverController Unit Tests", () => {
    let controller: DriverController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    const mockDriverService = DriverService as jest.MockedClass<typeof DriverService>;

    beforeEach(() => {
        controller = new DriverController();

        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        jest.clearAllMocks();
    });

    describe("createDriver", () => {

        test("should create driver successfully", async () => {

            req.body = {
                vehicleType: "Bike",
                vehicleNumber: "BA12PA1234",
                currentLocation: "Kathmandu"
            };

            req.user = {
                _id: "user123"
            } as any;

            mockDriverService.prototype.createDriver.mockResolvedValue({
                _id: "driver1",
                userId: "user123",
                vehicleType: "Bike",
                vehicleNumber: "BA12PA1234",
                currentLocation: "Kathmandu",
                isAvailable: true
            } as any);

            await controller.createDriver(req as Request, res as Response);

            expect(mockDriverService.prototype.createDriver)
                .toHaveBeenCalledWith(
                    "user123",
                    req.body
                );

            expect(res.status).toHaveBeenCalledWith(201);
        });

        test("should return 400 when validation fails", async () => {

            req.body = {};

            req.user = {
                _id: "user123"
            } as any;

            await controller.createDriver(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test("should return 401 when user is missing", async () => {

            req.body = {
                vehicleType: "Bike",
                vehicleNumber: "BA12PA1234",
                currentLocation: "Kathmandu"
            };

            await controller.createDriver(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        test("should handle service errors", async () => {

            req.body = {
                vehicleType: "Bike",
                vehicleNumber: "BA12PA1234",
                currentLocation: "Kathmandu"
            };

            req.user = {
                _id: "user123"
            } as any;

            mockDriverService.prototype.createDriver.mockRejectedValue(
                {
                    status: 500,
                    message: "Database Error"
                }
            );

            await controller.createDriver(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
        });

    });

    describe("getMyDriver", () => {

        test("should get current driver", async () => {

            req.user = {
                _id: "user123"
            } as any;

            mockDriverService.prototype.getDriverByUserId.mockResolvedValue({
                _id: "driver1",
                vehicleType: "Bike"
            } as any);

            await controller.getMyDriver(req as Request, res as Response);

            expect(mockDriverService.prototype.getDriverByUserId)
                .toHaveBeenCalledWith("user123");

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should return 401 if user not logged in", async () => {

            await controller.getMyDriver(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        test("should handle service exception", async () => {

            req.user = {
                _id: "user123"
            } as any;

            mockDriverService.prototype.getDriverByUserId.mockRejectedValue({
                status: 404,
                message: "Driver not found"
            });

            await controller.getMyDriver(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    describe("getDriverById", () => {

        test("should get driver by id", async () => {

            req.params = {
                id: "driver123"
            };

            mockDriverService.prototype.getDriverById.mockResolvedValue({
                _id: "driver123",
                vehicleType: "Bike",
                vehicleNumber: "BA12PA1234",
                currentLocation: "Kathmandu"
            } as any);

            await controller.getDriverById(req as Request, res as Response);

            expect(mockDriverService.prototype.getDriverById)
                .toHaveBeenCalledWith("driver123");

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should return 404 if driver does not exist", async () => {

            req.params = {
                id: "driver123"
            };

            mockDriverService.prototype.getDriverById.mockRejectedValue({
                status: 404,
                message: "Driver not found"
            });

            await controller.getDriverById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
        });

    });

    describe("getAllDrivers", () => {

        test("should return all drivers", async () => {

            mockDriverService.prototype.getAllDrivers.mockResolvedValue([
                {
                    _id: "1",
                    vehicleType: "Bike"
                },
                {
                    _id: "2",
                    vehicleType: "Car"
                }
            ] as any);

            await controller.getAllDrivers(req as Request, res as Response);

            expect(mockDriverService.prototype.getAllDrivers)
                .toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should handle service exception", async () => {

            mockDriverService.prototype.getAllDrivers.mockRejectedValue({
                status: 500,
                message: "Database error"
            });

            await controller.getAllDrivers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
        });

    });

    describe("getAvailableDrivers", () => {

        test("should return available drivers", async () => {

            mockDriverService.prototype.getAvailableDrivers.mockResolvedValue([
                {
                    _id: "1",
                    isAvailable: true
                },
                {
                    _id: "2",
                    isAvailable: true
                }
            ] as any);

            await controller.getAvailableDrivers(req as Request, res as Response);

            expect(mockDriverService.prototype.getAvailableDrivers)
                .toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should return empty array when no drivers are available", async () => {

            mockDriverService.prototype.getAvailableDrivers.mockResolvedValue([]);

            await controller.getAvailableDrivers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should handle service exception", async () => {

            mockDriverService.prototype.getAvailableDrivers.mockRejectedValue({
                status: 500,
                message: "Database error"
            });

            await controller.getAvailableDrivers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
        });

    });
    })});