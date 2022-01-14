const mongoose = require('mongoose');

//structure de donnee d'un user
const UserSchema = mongoose.Schema({
    userFirstName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('USER_DATA', UserSchema, 'USER_DATA');
