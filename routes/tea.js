const teaController = require('../controllers/tea');
const express = require('express');
const router = express.Router();
const token = require('../auth');

//GET
router.get('/', teaController.getTeas);
router.get('/instock', teaController.getTeasInStock);

// POST
router.post('/', teaController.newTeaRef);
router.post('/:id/stock', teaController.pushStock);

//PUT
router.put('/', teaController.modifyTea);

// DELETE 
router.delete('/', token, teaController.deleteTea);
router.delete('/all', teaController.deleteAllTea);

module.exports = router;