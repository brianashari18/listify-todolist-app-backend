import express from "express";

import userController from "../controller/user-controller.js";
import taskController from "../controller/task-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);
userRouter.get('/api/users/current', userController.get);
userRouter.delete('/api/users/logout', userController.logout);
userRouter.patch('/api/users/current', userController.changePassword);
userRouter.patch('/api/users/current', userController.changeUsername);


//task
userRouter.post('/api/tasks', taskController.create);
userRouter.get('/api/users/:username/tasks', taskController.get);


export {userRouter}