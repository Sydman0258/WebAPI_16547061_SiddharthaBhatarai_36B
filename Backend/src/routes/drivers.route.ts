import { Router } from "express";
import { DriverController } from "../controllers/driver.controllers";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const driverController = new DriverController();
const router = Router();

// Public routes
router.get("/", driverController.getAllDrivers);
router.get("/available", driverController.getAvailableDrivers);
router.get("/:id", driverController.getDriverById);

// Protected routes
router.post("/create", authorizedMiddleware, driverController.createDriver);
router.get("/my/profile", authorizedMiddleware, driverController.getMyDriver);
router.put("/update/:id", authorizedMiddleware, driverController.updateDriver);
router.patch("/toggle-availability", authorizedMiddleware, driverController.toggleAvailability);
router.delete("/delete/:id", authorizedMiddleware, driverController.deleteDriver);

export default router;