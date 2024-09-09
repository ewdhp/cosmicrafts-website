import express from 'express';
import SocialAuthController from '../controllers/social-auth.js';

const router = express.Router();


//temp
router.get('/', SocialAuthController.homePage);
// Twitter authentication route
router.get('/auth/twitter', SocialAuthController.twitterAuth);

// Twitter callback route
router.get('/auth/twitter/callback', SocialAuthController.twitterCallback);

export default router;
