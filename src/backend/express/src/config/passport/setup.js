// src/config/passport/setup.js
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as FacebookStrategy } from 'passport-facebook';

// Twitter Strategy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/auth/twitter/callback'
}, (token, tokenSecret, profile, done) => {
  // Save profile information to database or session here
  return done(null, profile);
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'email', 'name', 'picture.width(400)']
}, (accessToken, refreshToken, profile, done) => {
  // Save profile information to database or session here
  return done(null, profile);
}));

// Instagram Strategy
passport.use('instagram', new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID, // Instagram uses Facebook's API
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/instagram/callback',
  profileFields: ['id', 'email', 'name', 'picture.width(400)']
}, (accessToken, refreshToken, profile, done) => {
  // Save profile information to database or session here
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
