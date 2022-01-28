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


module.exports = {
  getLogs: getLogs
}
