
const express = require('express');

require('dotenv').config();
const session = require('express-session');


// Load Google OAuth configuration and authentication strategy.
const passport = require('./config/passport');


const { connectDB } = require('./db/connect');
const moviesRoutes = require('./routes/movies');

// Agrega las rutas de directores.
const directorsRoutes = require('./routes/directors');


// Import Google OAuth login, callback, and logout routes.
const authRoutes = require('./routes/auth');



const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

// Trust Render's proxy to correctly detect HTTPS connections.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}




app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
// Protect the session cookie and use HTTPS in production.
cookie: {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
}
}));

app.use(passport.initialize());
app.use(passport.session());




// Home route
app.get('/', (req, res) => {
  res.send('Movies API is running!');
});

// Movies routes
app.use('/movies', moviesRoutes);

app.use('/directors', directorsRoutes);

// Register Google OAuth authentication routes.
app.use('/auth', authRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
