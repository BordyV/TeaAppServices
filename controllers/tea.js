const teaModel = require('../models/tea.model');
const logModel = require('../models/log.model');
const jwtUtil = require('../util/jwtUtil');
const { format } = require("date-fns");


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
                    .then((result) => {
                        try {
                            const tokenId = jwtUtil.getIdUserFromToken(req);
                            const newLog = new logModel({
                                action: 'add-tea',
                                category: 'Tea',
                                createdBy: tokenId,
                                message: 'Ajout du thé ' + data.reference,
                                _idOperationDocument: result._id
                            });
                            newLog.save();
                        } catch (e) {

                        }
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

    teaModel.find({ reference: data.reference })
        .then(async function (rslt) {

            let exist = rslt.length > 0 ? true : false;
            // si aucune référence est trouvé ou que le document._id est la meme que celui qu'on souhaite modifier
            if (!exist || rslt[0]._id == data._id) {
                await teaModel.findOneAndUpdate(filter, update).then(result => {
                    try {
                        const tokenId = jwtUtil.getIdUserFromToken(req);
                        const newLog = new logModel({
                            action: 'modify-tea',
                            category: 'Tea',
                            createdBy: tokenId,
                            message: 'Modification du thé ' + data.reference,
                            _idOperationDocument: data._id
                        });
                        newLog.save();
                    } catch (e) {

                    }
                    res.status(200).send(result);
                })
                    .catch(error => {
                        res.status(400).send({ message: error.message });
                    });;
            }
            else {
                res.status(403).json({ erreur: "Référence déjà existante." });
            }

        })
        .catch(err => {
            res.status(400).send({ message: err.message });
        })
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
const getTeaById = (req, res) => {
    const _id = req.params.id;
    teaModel.findOne({ _id: _id }).then(result => {
        res.status(200).send(result);
    })
        .catch(error => {
            res.status(400).send({ message: error.message });
        });
}

//supprime un thé
const deleteTea = (req, res) => {
    const _id = req.query._id;
    teaModel.findOneAndDelete({ _id: _id }).then(result => {
        try {
            const tokenId = jwtUtil.getIdUserFromToken(req);
            const newLog = new logModel({
                action: 'delete-tea',
                category: 'Tea',
                createdBy: tokenId,
                message: 'Suppression du thé : ' + result.reference,
                _idOperationDocument: result._id
            });
            newLog.save();
        } catch (e) {
            console.log(e)
        }
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
    const _id = req.params.id;
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
            try {
                teaModel.findOne({ _id: _id })
                    .then(async (rslt) => {
                        let ref = rslt.reference;
                        const tokenId = jwtUtil.getIdUserFromToken(req);
                        const dateExpiration = Date.parse(data.dateExp);

                        const dateExpFinal = format(dateExpiration, "dd/MM/yyyy");
                        const newLog = new logModel({
                            action: 'add-stock',
                            category: 'Tea',
                            createdBy: tokenId,
                            message: 'Ajout de stock au thé ' + ref + ': ' + data.quantity + ' unités expirant le ' + dateExpFinal,
                            _idOperationDocument: _id
                        });
                        newLog.save();
                    })
                    .catch(err => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e)
            }
            res.status(200).json("Stock ajouté correctement");
        }
    })
        .catch(error => {
            res.status(400).send({ message: error.message });
        });
}


//delete du stock à un thé
const deleteStock = (req, res) => {
    const _id = req.params.id;
    const quantity = req.body.quantity;
    const tea = req.body.tea;
    teaModel.findOne({ _id: _id })
        .then(async (rslt) => {
            let exist = rslt.stocks.length > 0 ? true : false;
            if (exist) {
                let totalquantity = 0;
                for (let stock of rslt.stocks) {
                    totalquantity += stock.quantity;
                }
                //si on demande de supprimer plus de quantité qu'il y en a en stock
                if (totalquantity < quantity) {
                    res.status(403).json({ erreur: "la quantité demandé est supérieur à la quantité total du stock." });

                }
                else {
                    let resStocks = _deleteStockByQuantity(rslt.stocks, quantity);
                    teaModel.updateOne({ '_id': _id }, {
                        '$set': {
                            'stocks': resStocks
                        }
                    }).then(result => {
                        if (res.nModfied < 1) {
                            res.status(403).json({ erreur: "Référence introuvable, vérfier les champs." })
                        }
                        else {
                            try {
                                const tokenId = jwtUtil.getIdUserFromToken(req);
                                const newLog = new logModel({
                                    action: 'delete-stock',
                                    category: 'Tea',
                                    createdBy: tokenId,
                                    message: 'Suppression du stock du thé ' + tea.reference + ': ' + quantity + ' unités',
                                    _idOperationDocument: _id
                                });
                                newLog.save();
                            } catch (e) {

                            }
                            res.status(200).json("Stock supprimé correctement");
                        }
                    })
                        .catch(error => {
                            res.status(400).send({ message: error.message });
                        });
                }
            }
            else {
                res.status(403).json({ erreur: "la référence n'existe pas." });
            }

        })
        .catch(err => {
            res.status(400).send({ message: err.message });
        })
}

function _deleteStockByQuantity(stocks, quantity) {
    let stocksRes = [];
    let totalquantity;

    stocksRes = stocks.sort(function (a, b) {
        return new Date(a.dateExp) - new Date(b.dateExp);
    });

    let quantityTemp = quantity;
    //permet de controler combien de stock on a enlever 
    for (let stock of stocksRes) {
        //si la quantité dans le stock est supérieur à la quantité demandé on return
        if (stock.quantity > quantityTemp) {
            stock.quantity -= quantityTemp;
            quantityTemp -= quantityTemp;
        } else {
            quantityTemp = quantityTemp - stock.quantity;
            stock.quantity -= stock.quantity;
        }
        if (quantityTemp == 0) {
            let res = stocksRes.filter((stock) => {
                return stock.quantity > 0;
            });
            return res;
        }
    }
}


module.exports = {
    getTeas: getTeas,
    getTeaById: getTeaById,
    newTeaRef: newTeaRef,
    modifyTea: modifyTea,
    deleteTea: deleteTea,
    deleteAllTea: deleteAllTea,
    getTeasInStock: getTeasInStock,
    pushStock: pushStock,
    deleteStock: deleteStock
}
