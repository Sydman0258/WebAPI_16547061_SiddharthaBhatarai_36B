import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const paymentController = new PaymentController();

// Add payment methods
router.post(
    "/card",
    authorizedMiddleware,
    paymentController.addCard.bind(paymentController)
);

router.post(
    "/esewa",
    authorizedMiddleware,
    paymentController.addEsewaAccount.bind(paymentController)
);

// Get payment methods
router.get(
    "/",
    authorizedMiddleware,
    paymentController.getPayments.bind(paymentController)
);

router.get(
    "/:id",
    authorizedMiddleware,
    paymentController.getPaymentById.bind(paymentController)
);

// Update payment method
router.put(
    "/:id",
    authorizedMiddleware,
    paymentController.updatePayment.bind(paymentController)
);

// Set default payment
router.patch(
    "/:id/default",
    authorizedMiddleware,
    paymentController.setDefaultPayment.bind(paymentController)
);

// Delete payment method
router.delete(
    "/:id",
    authorizedMiddleware,
    paymentController.deletePayment.bind(paymentController)
);
// Existing
router.post(
    "/esewa",
    authorizedMiddleware,
    paymentController.addEsewaAccount.bind(paymentController)
);


export default router;