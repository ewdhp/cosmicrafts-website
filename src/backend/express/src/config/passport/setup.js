const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-facebook').Strategy; // Instagram uses Facebook strategy

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/auth/twitter/callback'
},
  (token, tokenSecret, profile, done) => {
    // Save profile information to database or session here
    return done(null, profile);
  }));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'email', 'name', 'picture.width(400)']
},
  (accessToken, refreshToken, profile, done) => {
    // Save profile information to database or session here
    return done(null, profile);
  }));

passport.use('instagram', new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID, // Instagram uses Facebook's API
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/instagram/callback',
  profileFields: ['id', 'email', 'name', 'picture.width(400)']
},
  (accessToken, refreshToken, profile, done) => {
    // Save profile information to database or session here
    return done(null, profile);
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
