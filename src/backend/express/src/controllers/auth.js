import passport from 'passport';
import { authStrategies } from '../config/passport.js';


const AuthController = {};

authStrategies.forEach(({ name }) => {

  // Define the authentication route for each strategy
  AuthController[`${name}Auth`] = passport.authenticate(name, { scope: [] });

  // Define the callback route for each strategy
  AuthController[`${name}Callback`] = (req, res, next) => {
    passport.authenticate(name, (err, user, info) => {
      if (err) return next(err); 
      if (!user) return res.redirect('/');
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect('/'); 
      });
    })(req, res, next);
  };
});

AuthController.logout = (req, res) => {
  req.logout(() => { });
  res.redirect('/'); 
};

export default AuthController;