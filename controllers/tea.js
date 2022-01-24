const teaModel = require('../models/tea.model');

//ajoute un nouveau thé
const newTeaRef = (req, res) => {
    const data = req.body;
    const newTea = new teaModel({
        reference: data.reference,
        name: data.name,
        stocks: data.stocks
    });

    //controle pour savoir si la ref existe déjà
    teaModel.find({ reference: data.reference })
        .then(async function (rslt) {

            let exist = rslt.length > 0 ? true : false;
            if (!exist) {
                await newTea.save()
                    .then(() => {
                        res.json({ message: "Référence ajoutée correctement" });
                    })
                    .catch(err => {
                        res.status(400).json({ message: err.message });
                    })
            }
            else {
                res.status(403).json({ erreur: "Référence déjà existante." });
            }

        })
        .catch(err => {
            res.status(400).send({ message: err.message });
        })
}

//modifie un thé
const modifyTea = (req, res) => {
    const data = req.body;

    const filter = { _id: data._id };
    const update = {
        reference: data.reference,
        name: data.name,
        stocks: data.stocks
    };

    // `doc` is the document _after_ `update` was applied because of
    // `returnOriginal: false`
    teaModel.findOneAndUpdate(filter, update).then(result => {
        res.status(200).send(result);
    })
        .catch(error => {
            res.status(400).send({ message: error.message });
        });;
}

//recupere tout les thes
const getTeas = (req, res) => {
    teaModel.find().then(result => {
        res.status(200).send(result);
    })
        .catch(error => {
            res.status(400).send({ message: error.message });
        });

}


//recupere tout les thes avec du stock
const getTeasInStock = (req, res) => {
    teaModel.find({ stocks: { $exists: true, $not: { $size: 0 } } }).then(result => {
        res.status(200).send(result);
    })
        .catch(error => {
            res.status(400).send({ message: error.message });
        });

}

//supprime un thé
const deleteTea = (req, res) => {
    _id = req.query._id;
    teaModel.deleteMany({ _id: _id }).then(result => {
        res.status(200).send(result);
    })
        .catch(error => {
            res.status(400).send({ message: error.message });
        });
}

//supprime un thé
const deleteAllTea = (req, res) => {
    teaModel.deleteMany().then(result => {
        res.status(200).send(result);
    })
        .catch(error => {
            res.status(400).send({ message: error.message });
        });
}


//ajoute du stock à un thé
const pushStock = (req, res) => {
    _id = req.params.id;
    const data = req.body;
    const newStock = {
        location: data.location,
        dateExp: data.dateExp,
        quantity: data.quantity
    };
    teaModel.updateOne(
        { _id: _id },
        { $push: { stocks: newStock } }
    ).then(result => {
        if (res.nModfied < 1) {
            res.status(403).json({ erreur: "Référence introuvable, vérfier les champs." })
        }
        else {
            res.status(200).json("Stock ajouté correctement");
        }
    })
        .catch(error => {
            res.status(400).send({ message: error.message });
        });;
}


module.exports = {
    getTeas: getTeas,
    newTeaRef: newTeaRef,
    modifyTea: modifyTea,
    deleteTea: deleteTea,
    deleteAllTea: deleteAllTea,
    getTeasInStock: getTeasInStock,
    pushStock: pushStock
}
