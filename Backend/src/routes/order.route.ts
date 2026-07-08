import { Router } from "express";
import { OrderController } from "../controllers/order.controllers";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const orderController = new OrderController();
const router = Router();

// Protected routes (all order routes require auth)
router.post("/create", authorizedMiddleware, orderController.createOrder);
router.get("/my", authorizedMiddleware, orderController.getMyOrders);
router.get("/restaurant/:restaurantId", authorizedMiddleware, orderController.getOrdersByRestaurant);
router.get("/available", authorizedMiddleware, orderController.getAvailableOrders);
router.get("/driver/:driverId", authorizedMiddleware, orderController.getOrdersByDriver);
router.get("/:id", authorizedMiddleware, orderController.getOrderById);
router.put("/update/:id", authorizedMiddleware, orderController.updateOrder);
router.patch("/status/:id", authorizedMiddleware, orderController.updateOrderStatus);
router.patch("/assign-driver/:id", authorizedMiddleware, orderController.assignDriver);
router.patch("/cancel/:id", authorizedMiddleware, orderController.cancelOrder);

export default router;