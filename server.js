
const express = require('express');
const { connectDB } = require('./db/connect');
const moviesRoutes = require('./routes/movies');



const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Movies API is running!');
});

// Movies routes
app.use('/movies', moviesRoutes);

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
