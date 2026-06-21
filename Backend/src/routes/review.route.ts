import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const reviewController = new ReviewController();
const router = Router();

// Public routes
router.get("/restaurant/:restaurantId", reviewController.getReviewsByRestaurant);
router.get("/driver/:driverId", reviewController.getReviewsByDriver);
router.get("/:id", reviewController.getReviewById);

// Protected routes
router.post("/create", authorizedMiddleware, reviewController.createReview);
router.get("/my/reviews", authorizedMiddleware, reviewController.getMyReviews);
router.put("/update/:id", authorizedMiddleware, reviewController.updateReview);
router.delete("/delete/:id", authorizedMiddleware, reviewController.deleteReview);

export default router;