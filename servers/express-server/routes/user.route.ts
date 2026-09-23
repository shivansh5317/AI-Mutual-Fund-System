import { userAuthController } from 'controller/user.controller.js';
import { Router, type Router as ExpressRouter } from 'express';

export const userRouter : ExpressRouter = Router();

userRouter.post('/user/auth' , userAuthController);