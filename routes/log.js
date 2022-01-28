const logController = require('../controllers/log');
const express = require('express');
const router = express.Router();
const token = require('../auth');

// GET
router.get('/', logController.getLogs); // renvoi tous les logs

module.exports = router;