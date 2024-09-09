import passport from 'passport';

const SocialAuthController = {
  homePage: (req, res) => {
    if (req.isAuthenticated()) {
      res.send(`Hello, ${req.user.username}`);
    } else {
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login with Twitter</title>
      </head>
      <body>
          <h1>Welcome to the Login Example</h1>
          
          <!-- Twitter Login Button -->
          <a href="/auth/twitter">
              <button>Login with Twitter</button>
          </a>

          <!-- Facebook Login Button -->
          <a href="/auth/facebook">
              <button>Login with Facebook</button>
          </a>

          <!-- Instagram Login Button -->
          <a href="/auth/instagram">
              <button>Login with Instagram</button>
          </a>
          
      </body>
      </html>
    `);
    }
  },

  facebookAuth: passport.authenticate('facebook'),
  facebookCallback: (req, res, next) => {
    passport.authenticate('facebook', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/'); // Redirect on failure
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  },

  instagramAuth: passport.authenticate('instagram'),
  instagramCallback: (req, res, next) => {
    passport.authenticate('instagram', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/'); // Redirect on failure
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  },

  twitterAuth: passport.authenticate('twitter'),
  twitterCallback: (req, res, next) => {
    passport.authenticate('twitter', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/'); // Redirect on failure
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  },

  logout: (req, res) => {
    req.logout(() => { });
    res.redirect('/');
  }
};

export default SocialAuthController;
