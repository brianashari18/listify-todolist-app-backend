import express from "express";

import userController from "../controller/user-controller.js";
import taskController from "../controller/task-controller.js";
import subTaskController from "../controller/subtask-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import workspaceController from "../controller/workspace-controller.js";
import feedbackController from "../controller/feedback-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

//user
userRouter.get('/api/users/current', userController.get);
userRouter.delete('/api/users/logout', userController.logout);
userRouter.patch('/api/users/current', userController.changePassword);
userRouter.patch('/api/users/current/userId', userController.changeUsername);

//task
userRouter.post('/api/tasks', taskController.create);
userRouter.get('/api/users/:userId/tasks', taskController.get);
userRouter.patch('/api/users/:userId/tasks/:taskId', taskController.update);
userRouter.delete('/api/users/:userId/tasks/:taskId', taskController.deleteTask);
userRouter.post('/api/tasks/:taskId', taskController.addTaskToWorkspace);

//subtask
userRouter.post('/api/tasks/:taskId/subtask', subTaskController.create);
userRouter.get('/api/tasks/:taskId/subtask', subTaskController.get);
userRouter.get('/api/users/subtask/', subTaskController.getByName)
userRouter.patch('/api/tasks/:taskId/:subTaskId', subTaskController.update);
userRouter.delete('/api/tasks/:taskId/:subTaskId', subTaskController.deleteSubTask);

//workspace
userRouter.post('/api/workspace/tasks', workspaceController.create);
userRouter.post('/api/workspace/:taskId', workspaceController.addUser);
userRouter.get('/api/workspace/:userId/tasks', workspaceController.get);
userRouter.patch('/api/workspace/:userId/tasks/:taskId',workspaceController.update);
userRouter.delete('/api/workspace/:userId/tasks/:taskId', workspaceController.deleteTaskWorkspace);

//feedback
userRouter.post('/api/users/:userId/feedback', feedbackController.sendFeedback);

export {userRouter}