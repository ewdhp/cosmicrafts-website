import express from 'express';
import authController from '../../controllers/auth/AuthController.js';

const authRouter = express.Router();

authRouter.get('/', authController.homePage);
authRouter.get('/facebook', authController.facebookAuth);
authRouter.get('/facebook/callback', authController.facebookCallback);
authRouter.get('/instagram', authController.instagramAuth);
authRouter.get('/instagram/callback', authController.instagramCallback);
authRouter.get('/twitter', authController.twitterAuth);
authRouter.get('/twitter/callback', authController.twitterCallback);
authRouter.get('/logout', authController.logout);

export default authRouter;
