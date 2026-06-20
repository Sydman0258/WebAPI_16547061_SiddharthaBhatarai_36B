import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";
import { uploads } from "../middleware/upload.middleware";

const restaurantController = new RestaurantController();
const router = Router();

// Public routes
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);

// Protected routes
router.post(
  "/create",
  authorizedMiddleware,
  restaurantController.createRestaurant
);

router.get(
  "/my/restaurant",
  authorizedMiddleware,
  restaurantController.getMyRestaurant
);

router.put(
  "/update/:id",
  authorizedMiddleware,
  uploads.single("restaurantImage"),
  restaurantController.updateRestaurant
);

router.delete(
  "/delete/:id",
  authorizedMiddleware,
  restaurantController.deleteRestaurant
);

export default router;