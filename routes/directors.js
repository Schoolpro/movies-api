
const express = require('express');
const router = express.Router();

const directorsController = require('../controllers/directorsController');
const requireAuth = require('../middleware/authenticate');


// Las consultas no necesitan iniciar sesión.
router.get('/', directorsController.getAllDirectors);

router.get('/:id', directorsController.getDirectorById);


// Para agregar, editar o borrar, primero hay que iniciar sesión.
router.post('/', requireAuth, directorsController.createDirector);

router.put('/:id', requireAuth, directorsController.updateDirector);

router.delete('/:id', requireAuth, directorsController.deleteDirector);


module.exports = router;
