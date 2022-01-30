const teaController = require('../controllers/tea');
const express = require('express');
const router = express.Router();
const token = require('../auth');

//GET
router.get('/', token, teaController.getTeas);
router.get('/:id', token, teaController.getTeaById);
router.get('/instock', token, teaController.getTeasInStock);

// POST
router.post('/', token, teaController.newTeaRef);
router.post('/:id/stock', token, teaController.pushStock);

//PUT
router.put('/', token, teaController.modifyTea);
router.put('/:id/stock/out', token, teaController.deleteStock);

// DELETE 
router.delete('/', token, teaController.deleteTea);
router.delete('/all', token, teaController.deleteAllTea);

module.exports = router;