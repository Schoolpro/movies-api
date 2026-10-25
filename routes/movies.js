
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


// GET - Get movie by ID
router.get('/:id', moviesController.getMovieById);


 // PUT - Update movie by ID
router.put('/:id', moviesController.updateMovie);



 // DELETE - Delete movie by ID
router.delete('/:id', moviesController.deleteMovie);


module.exports = router;
