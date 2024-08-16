const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();
const authRoutes = require('./src/routes/auth_routes');
require('./src/config/passport/setup');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
