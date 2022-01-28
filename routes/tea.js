const teaController = require('../controllers/tea');
const express = require('express');
const router = express.Router();
const token = require('../auth');

//GET
router.get('/', teaController.getTeas);
router.get('/instock', teaController.getTeasInStock);

// POST
router.post('/', token, teaController.newTeaRef);
router.post('/:id/stock', token, teaController.pushStock);

//PUT
router.put('/', teaController.modifyTea);
router.put('/:id/stock/out', teaController.deleteStock);

// DELETE 
router.delete('/', token, teaController.deleteTea);
router.delete('/all', teaController.deleteAllTea);

module.exports = router;