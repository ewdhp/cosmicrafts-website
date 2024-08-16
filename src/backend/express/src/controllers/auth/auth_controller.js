const passport = require('passport');

// Handle the homepage route
exports.homePage = (req, res) => {
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
};

// Facebook Authentication
exports.facebookAuth = passport.authenticate('facebook');
exports.facebookCallback = (req, res, next) => {
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
};

// Instagram Authentication
exports.instagramAuth = passport.authenticate('instagram');
exports.instagramCallback = (req, res, next) => {
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
};

// Twitter Authentication
exports.twitterAuth = passport.authenticate('twitter');
exports.twitterCallback = (req, res, next) => {
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
};

// Logout
exports.logout = (req, res) => {
  req.logout(() => { });
  res.redirect('/');
};
