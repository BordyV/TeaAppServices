const userModel = require('../models/user.model');
const { Mongoose } = require('mongoose');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

//ajoute un nouvel utilisateur
const newUser = async (req, res) => {
    const data = req.body;
    console.error(data);

    const newUser = new userModel({
        userFirstName: data.userFirstName.toUpperCase(),
        userLastName: data.userLastName.toUpperCase(),
        userEmail: data.userEmail,
        userPassword: bcrypt.hashSync(data.userPassword, 8),
    });

    //control to know if user already exist
    await userModel.find({ userEmail: data.userEmail })
        .then(async function (rslt) {

            let exist = rslt.length > 0 ? true : false;
            if (!exist) {
                await newUser.save()
                    .then(data => {
                        res.json({ message: "Sucess, correctly added to the dataBASE" });
                    })
                    .catch(err => {
                        res.status(400).json({ message: err.message });
                    })
            }
            else {
                res.status(403).json({ erreur: "Déjà inscrit..." });
            }

        })
        .catch(err => {
            res.status(400).send({ message: err.message });
        })

}
//recupere tout les utilisateurs
const getUsers = async (req, res) => {
    await userModel.find()
        .then(result => {
            res.status(200).send(result)
        })
        .catch(error => {
            res.send({ message: error.message })
        })
}

//verifie sil est deja enregistré
const isAlreadyRegistered = async (req, res) => {
    const body = req.body;
    await userModel.find({ userEmail: body.userEmail })
        .then(rslt => {
            rslt.length ? res.status(403).json({ erreur: "Déjà inscrit..." }) : res.status(200).json({ erreur: "Tu peux entrer akhi" })
        })
        .catch(err => {
            res.status(400).send({ message: err.message });
        })
}


//permet de connecter en verifiant le hash du mot de passe recu dans le body a celui enregistrer dans la bd, si oui on renvoie un succes et un jeton.
//ce jeton permettra de securiser les appels a certaines route de l'api en l'exigeant dans le header de la requete.
const connection = async (req, res) => {
    const data = req.body;

    await userModel.findOne({ userEmail: data.userEmail })
        .then(result => {
            if (result) {
                if (bcrypt.compareSync(data.userPassword, result.userPassword)) {
                    jwt.sign(
                        { email: data.userEmail, id: result._id },
                        process.env.JWT_SECRET,
                        { expiresIn: "1d" },
                        (err, token) => {
                            if (err) throw err;
                            res.status(200).json(
                                {
                                    userId: result._id,
                                    code: res.statusCode,
                                    token
                                });
                        }
                    );

                } else {
                    res.status(401).send({ message: "Wrong password" })
                }
            } else {
                res.status(401).send({ message: "Wrong email" })
            }
        })
        .catch(error => {
            res.status(400).send({ message: error.message })
        })
}





module.exports = {
    newUser: newUser,
    getUsers: getUsers,
    connection: connection,
    isAlreadyRegistered: isAlreadyRegistered
}
