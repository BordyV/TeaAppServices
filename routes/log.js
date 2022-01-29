const logController = require('../controllers/log');
const express = require('express');
const router = express.Router();
const token = require('../auth');

// GET
router.get('/', logController.getLogs); // renvoi tous les logs
router.get('/:id', logController.getLogsByidOperationDocument); // renvoi tous les logs en fonction de l'idOperationDocument

// DELETE 
router.delete('/all', logController.deleteAllLogs);

module.exports = router;