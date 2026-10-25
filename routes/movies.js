
const express = require('express');
const router = express.Router();

const moviesController = require('../controllers/moviesController');

// GET all movies
router.get('/', moviesController.getAllMovies);


 // POST a new movie
router.post('/', (req, res, next) => {
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Movie information',
    required: true,
    schema: {
      title: 'Interstellar',
      director: 'Christopher Nolan',
      year: 2014,
      genre: 'Sci-Fi',
      rating: 9,
      language: 'English',
      duration: 169
    }
  } */
  next();
}, moviesController.createMovie);


// GET movie by ID
router.get('/:id', (req, res) => {
  // #swagger.summary = 'Get movie by ID'
  res.status(501).json({ message: 'Not implemented yet' });
});

// PUT update movie
router.put('/:id', (req, res) => {
  // #swagger.summary = 'Update movie by ID'
  res.status(501).json({ message: 'Not implemented yet' });
});

// DELETE movie
router.delete('/:id', (req, res) => {
  // #swagger.summary = 'Delete movie by ID'
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;
