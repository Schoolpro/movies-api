
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

module.exports = { getAllMovies, createMovie };
