const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();
const token = require('../auth');

// POST
router.post('/addUser', userController.newUser); // créer un nouvel utilisateur (voir le model pour le body)
router.post('/connection', userController.connection); //connection
router.post('/isAlreadyRegistered', userController.isAlreadyRegistered);
// GET
router.get('/', token, userController.getUsers); // renvoi tous les users

module.exports = router;