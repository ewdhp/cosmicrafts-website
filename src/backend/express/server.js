// src/server.js
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

import metaRoutes from './src/apis/meta.js';
import cRoutes from './src/apis/cosmicrafts.js';

// Load environment variables
dotenv.config();

// Setup Passport
// Ensure this is imported before initializing routes
import './src/config/passport.js'; 

const app = express();

// Session and Passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Ensure this is set
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes

app.use('/cosmicrafts', cRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
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
  };
});