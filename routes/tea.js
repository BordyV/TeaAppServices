const teaController = require('../controllers/tea');
const express = require('express');
const router = express.Router();
const token = require('../auth');

//GET
router.get('/', teaController.getTeas);

// POST
router.post('/', teaController.newTeaRef);

//PUT
router.put('/', teaController.modifyTea);

// DELETE 
router.delete('/', token, teaController.deleteTea);

module.exports = router;