import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";

const customerController=new CustomerController();
const router=Router();

router.post("/register",customerController.createCustomer);
router.post("/login",customerController.loginCustomer);

export default router;