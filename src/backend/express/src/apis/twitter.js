import express from 'express';
import SocialAuthController from '../../controllers/auth/social-auth-controller.js';

const twitterRouter = express.Router();

twitterRouter.get('/', SocialAuthController.homePage);
twitterRouter.get('/twitter/callback', SocialAuthController.twitterCallback);
twitterRouter.get('/logout', SocialAuthController.logout);

export default twitterRouter;
