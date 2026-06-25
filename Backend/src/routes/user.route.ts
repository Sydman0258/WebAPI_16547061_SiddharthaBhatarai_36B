import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";
import { uploads } from "../middleware/upload.middleware";

const userController=new UserController();
const router=Router();

router.post("/register",userController.createUser);
router.post("/login",userController.loginUser);
router.put(
    "/update",
    authorizedMiddleware, 
    uploads.single("profileImage"), 
    userController.updateUser
);
router.get(
    "/getProfile",
    authorizedMiddleware, 
    userController.getUser
);
router.post("/request-password-reset", userController.sendResetPasswordEmail);
router.post("/reset-password/:token", userController.resetPassword);


export default router;