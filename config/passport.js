
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Google OAuth authentication.
// Google verifies the user's identity and returns their profile.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,

  // Comprueba que la respuesta de Google venga del mismo navegador.
  state: true,


// Use the Google OAuth callback URL for each environment.
callbackURL: process.env.GOOGLE_CALLBACK_URL}, (accessToken, refreshToken, profile, done) => {
 
 
 
    // Pass the authenticated Google profile to Passport.
  return done(null, profile);
}));

// Save the Google user profile in the session.
passport.serializeUser((user, done) => {
  done(null, user);
});

// Restore the user profile from the session.
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;

