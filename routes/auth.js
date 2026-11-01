
const express = require('express');
const passport = require('../config/passport');

const router = express.Router();

// Start Google login.
// Redirect the user to Google to authenticate.
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Handle Google's response after login.
// Redirect to the home page if successful.
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.redirect('/');
  }
);

// Show the currently authenticated user's basic information.
router.get('/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  }

  res.status(200).json({
    name: req.user.displayName,
    email: req.user.emails?.[0]?.value
  });
});

// Log out the current user and end their session.
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    // Remove the session from the server.
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      // Clear the session cookie from the browser.
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;

