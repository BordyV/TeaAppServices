const jwt_decode = require('jwt-decode');

function getIdUserFromToken(req) {
  try {
    const token = req.header('x-auth-token');
    const tokenInfo = jwt_decode(token);
    return tokenInfo.id;
  } catch (e) {
    return "inconnu";
  }
}

module.exports = {
  getIdUserFromToken: getIdUserFromToken,
}
