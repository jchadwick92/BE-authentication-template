const User = require("../users/User");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../config/settings").secretOrKey;

module.exports = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  const payload = getPayload(res, bearerToken);
  User.findById(payload.id).then(user => {
    if (!user.admin) {
      res.status(403).json({ unauthorized: "User must have admin rights" });
    } else {
      next();
    }
  });
};

function getPayload(res, bearerToken) {
  if (!bearerToken) {
    return res.status(403).end();
  }
  const token = bearerToken.split(" ")[1];
  const payload = jwt.verify(token, secretOrKey);
  return payload;
}
