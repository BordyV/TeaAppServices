const logModel = require('../models/log.model');

//recupere tout les logs
const getLogs = async (req, res) => {
  await logModel.find()
    .then(result => {
      res.status(200).send(result)
    })
    .catch(error => {
      res.send({ message: error.message })
    })
}

//recupere tout les logs en fonction de l'idOperationDocument
const getLogsByidOperationDocument = async (req, res) => {
  const _idOperationDocument = req.params.id;
  await logModel.find({ _idOperationDocument: _idOperationDocument })
    .then(result => {
      res.status(200).send(result)
    })
    .catch(error => {
      res.send({ message: error.message })
    })
}

//supprime tout les logs
const deleteAllLogs = (req, res) => {
  logModel.deleteMany().then(result => {
    res.status(200).send(result);
  })
    .catch(error => {
      res.status(400).send({ message: error.message });
    });
}

module.exports = {
  getLogs: getLogs,
  getLogsByidOperationDocument: getLogsByidOperationDocument,
  deleteAllLogs: deleteAllLogs
}
