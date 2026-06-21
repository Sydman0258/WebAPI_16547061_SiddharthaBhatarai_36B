import { Router } from "express";
import { MenuItemController } from "../controllers/menu.controllers";
import { authorizedMiddleware } from "../middleware/authorized.middleware";
import { uploads } from "../middleware/upload.middleware";

const menuItemController = new MenuItemController();
const router = Router();

// Public routes
router.get("/restaurant/:restaurantId", menuItemController.getMenuByRestaurant);
router.get("/restaurant/:restaurantId/available", menuItemController.getAvailableMenu);
router.get("/restaurant/:restaurantId/category/:category", menuItemController.getMenuByCategory);
router.get("/:id", menuItemController.getMenuItemById);

// Protected routes
router.post(
    "/create/:restaurantId",
    authorizedMiddleware,
    uploads.single("itemImage"),
    menuItemController.createMenuItem
);
router.put(
    "/update/:id",
    authorizedMiddleware,
    uploads.single("itemImage"),
    menuItemController.updateMenuItem
);
router.patch("/toggle/:id", authorizedMiddleware, menuItemController.toggleAvailability);
router.delete("/delete/:id", authorizedMiddleware, menuItemController.deleteMenuItem);

export default router;