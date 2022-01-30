const logController = require('../controllers/log');
const express = require('express');
const router = express.Router();
const token = require('../auth');

// GET
router.get('/', token, logController.getLogs); // renvoi tous les logs
router.get('/pagination', token, logController.getLogsPagination); // renvoi tous les logs avec pagination
router.get('/:id', token, logController.getLogsByidOperationDocument); // renvoi tous les logs en fonction de l'idOperationDocument

// PUT 
router.put('/', token, logController.updateLog);

// DELETE 
router.delete('/all', token, logController.deleteAllLogs);

module.exports = router;