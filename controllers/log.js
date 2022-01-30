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

//recupere tout les logs
const getLogsPagination = async (req, res) => {
  let aggregateQuery = logModel.aggregate();

  await logModel.aggregatePaginate(aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 6,
      sort: { createdAt: -1 },

    },
    (err, logs) => {
      if (err) {
        res.send({ message: err.message });
      }
      res.status(200).send(logs);
    }
  );
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

//modifie le log donné
const updateLog = (req, res) => {
  const data = req.body;
  const filter = { _id: data._id };
  const update = {
    commentaire: data.commentaire,
  };

  logModel.updateOne(filter, update).then(result => {
    res.status(200).send(result);
  })
    .catch(error => {
      res.status(400).send({ message: error.message });
    });;
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
  getLogsPagination: getLogsPagination,
  getLogsByidOperationDocument: getLogsByidOperationDocument,
  updateLog: updateLog,
  deleteAllLogs: deleteAllLogs
}
