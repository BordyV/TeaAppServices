const logController = require('../controllers/log');
const express = require('express');
const router = express.Router();
const token = require('../auth');

// GET
router.get('/', logController.getLogs); // renvoi tous les logs

// DELETE 
router.delete('/all', logController.deleteAllLogs);

module.exports = router;