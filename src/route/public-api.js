import express from 'express';
import userController from '../controller/user-controller.js'
import googleController from "../controller/google-controller.js";

const publicRouter = express.Router();
publicRouter.post('/api/users/register', userController.register);
publicRouter.post('/api/users/login', userController.login);
publicRouter.post('/api/users/forgot-password', userController.forgotPassword);
publicRouter.post('/api/users/validateOtp', userController.validateOtp);
publicRouter.post('/api/users/reset-password', userController.resetPassword);

//google login
publicRouter.get('/api/users/google', googleController.initiateGoogleLogin);
publicRouter.post('/api/users/google/callback', googleController.handleGoogleCallback);


export {
    publicRouter,
}