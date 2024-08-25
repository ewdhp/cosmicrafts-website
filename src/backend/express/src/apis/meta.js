import express from 'express';
import SocialAuthController from '../controllers/social-auth.js';

const router = express.Router();

// Facebook authentication route
router.get('/auth/facebook', SocialAuthController.facebookAuth);

// Facebook callback route
router.get('/auth/facebook/callback', SocialAuthController.facebookCallback);


// Instagram authentication route
router.get('/auth/instagram', SocialAuthController.instagramAuth);

// Instagram callback route
router.get('/auth/instagram/callback', SocialAuthController.instagramCallback);

export default router;