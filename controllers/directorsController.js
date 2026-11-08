
const { getDB } = require('../db/connect');
const { ObjectId } = require('mongodb');


// Revisa los datos antes de guardarlos.
function validDirector(director) {
  const requiredFields = [
    'name',
    'birthYear',
    'nationality',
    'biography'
  ];

  return (
    director &&
    typeof director === 'object' &&
    !Array.isArray(director) &&
    Object.keys(director).length === requiredFields.length &&
    requiredFields.every(field =>
      Object.prototype.hasOwnProperty.call(director, field)
    ) &&
    ['name', 'nationality', 'biography'].every(
      field => typeof director[field] === 'string' && director[field].trim() !== ''
    ) &&
    Number.isInteger(director.birthYear) &&
    director.birthYear >= 1800 &&
    director.birthYear <= new Date().getFullYear()
  );
}


// Devuelve la lista de directores.
async function getAllDirectors(req, res) {
  try {
    const directors = await getDB()
      .collection('directors')
      .find()
      .toArray();

    res.status(200).json(directors);
  } catch (error) {
    res.status(500).json({ message: 'Error getting directors' });
  }
}


// Guarda un director nuevo.
async function createDirector(req, res) {
  try {
    const director = req.body;

    if (!validDirector(director)) {
      return res.status(400).json({
        message: 'Invalid director data'
      });
    }

    const result = await getDB()
      .collection('directors')
      .insertOne(director);

    res.status(201).json({
      id: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating director' });
  }
}


// Actualiza un director que ya existe.
async function updateDirector(req, res) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid director ID' });
    }

    const director = req.body;

    if (!validDirector(director)) {
      return res.status(400).json({
        message: 'Invalid director data'
      });
    }

    const result = await getDB()
      .collection('directors')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: director }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Director not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error updating director' });
  }
}


// Borra el director indicado.
async function deleteDirector(req, res) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid director ID'
      });
    }

    const result = await getDB()
      .collection('directors')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Director not found'
      });
    }

    res.status(200).json({
      message: 'Director deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting director'
    });
  }
}


// Busca un director por su ID.
async function getDirectorById(req, res) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid director ID'
      });
    }

    const director = await getDB()
      .collection('directors')
      .findOne({ _id: new ObjectId(id) });

    if (!director) {
      return res.status(404).json({
        message: 'Director not found'
      });
    }

    res.status(200).json(director);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting director'
    });
  }
}


module.exports = {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector
};
