
const { getDB } = require('../db/connect');

// GET - Get all movies
async function getAllMovies(req, res) {
  try {
    const movies = await getDB()
      .collection('movies')
      .find()
      .toArray();

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error getting movies' });
  }
}

// POST - Create a new movie
async function createMovie(req, res) {
  try {
    const movie = req.body;




    // Validate movie data
    const requiredFields = [
      'title',
      'director',
      'year',
      'genre',
      'rating',
      'language',
      'duration'
    ];

    if (
      !movie ||
      typeof movie !== 'object' ||
      Array.isArray(movie) ||
      Object.keys(movie).length !== requiredFields.length ||
      !requiredFields.every(field =>
        Object.prototype.hasOwnProperty.call(movie, field)
      ) ||
      !['title', 'director', 'genre', 'language'].every(
        field => typeof movie[field] === 'string' && movie[field].trim() !== ''
      ) ||
      !Number.isInteger(movie.year) ||
      movie.year < 1888 ||
      !Number.isFinite(movie.rating) ||
      movie.rating < 0 ||
      movie.rating > 10 ||
      !Number.isInteger(movie.duration) ||
      movie.duration <= 0
    ) {
      return res.status(400).json({
        message: 'Invalid movie data'
      });
    }






    const result = await getDB()
      .collection('movies')
      .insertOne(movie);

    res.status(201).json({
      id: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating movie' });
  }
}




const { ObjectId } = require('mongodb');

// PUT - Update a movie
async function updateMovie(req, res) {
  try {
    const id = req.params.id;

    // Validate MongoDB ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const movie = req.body;


    // Validate movie data
    const requiredFields = [
      'title', 'director', 'year', 'genre',
      'rating', 'language', 'duration'
    ];

    if (
      !movie ||
      typeof movie !== 'object' ||
      Array.isArray(movie) ||
      Object.keys(movie).length !== requiredFields.length ||
      !requiredFields.every(field =>
        Object.prototype.hasOwnProperty.call(movie, field)
      ) ||
      !['title', 'director', 'genre', 'language'].every(
        field => typeof movie[field] === 'string' && movie[field].trim() !== ''
      ) ||
      !Number.isInteger(movie.year) ||
      movie.year < 1888 ||
      !Number.isFinite(movie.rating) ||
      movie.rating < 0 ||
      movie.rating > 10 ||
      !Number.isInteger(movie.duration) ||
      movie.duration <= 0
    ) {
      return res.status(400).json({
        message: 'Invalid movie data'
      });
    }

    

    const result = await getDB()

      .collection('movies')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: movie }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie' });
  }
}



 // DELETE - Delete a movie
async function deleteMovie(req, res) {
  try {
    const id = req.params.id;

    // Validate MongoDB ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid movie ID'
      });
    }

    const result = await getDB()
      .collection('movies')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting movie'
    });
  }
}







 // GET - Get a movie by ID
async function getMovieById(req, res) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid movie ID'
      });
    }

    const movie = await getDB()
      .collection('movies')
      .findOne({ _id: new ObjectId(id) });

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found'
      });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting movie'
    });
  }
}




module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};
