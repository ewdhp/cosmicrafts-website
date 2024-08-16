const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth_controller'); // Make sure this path is correct

// Define routes
router.get('/', authController.homePage);
router.get('/auth/facebook', authController.facebookAuth);
router.get('/auth/facebook/callback', authController.facebookCallback);
router.get('/auth/instagram', authController.instagramAuth);
router.get('/auth/instagram/callback', authController.instagramCallback);
router.get('/auth/twitter', authController.twitterAuth);
router.get('/auth/twitter/callback', authController.twitterCallback);
router.get('/logout', authController.logout);

module.exports = router;
