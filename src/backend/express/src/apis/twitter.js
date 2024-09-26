import express from 'express';
import SocialAuthController from '../controllers/social-auth.js';

const router = express.Router();


//temp
router.get('/', SocialAuthController.homePage);

router.get('/auth/twitter', SocialAuthController.twitterAuth);
router.get('/auth/twitter/callback', SocialAuthController.twitterCallback);

export default router;
