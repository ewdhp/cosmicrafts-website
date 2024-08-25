import express from 'express';
import SocialAuthController from '../../controllers/auth/social-auth-controller.js';

const metaRouter = express.Router();

metaRouter.get('/facebook', SocialAuthController.facebookAuth);
metaRouter.get('/facebook/callback', SocialAuthController.facebookCallback);
metaRouter.get('/instagram', SocialAuthController.instagramAuth);
metaRouter.get('/instagram/callback', SocialAuthController.instagramCallback);

export default metaRouter;