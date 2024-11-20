import express from 'express';
import userController from '../controller/user-controller.js'
import {validateOTP} from "../middleware/OTP-validation-middleware.js";

const publicRouter = express.Router();
publicRouter.post('/api/users', userController.register);
publicRouter.post('/api/users/login', userController.login);
publicRouter.post('/api/users/forgot-password', userController.forgotPassword);
publicRouter.post('/api/users/reset-password',validateOTP, userController.resetPassword);

export {
    publicRouter,
}