const ObjectId = require("mongoose").Types.ObjectId;
function isObjectIdValid(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

module.exports = { isObjectIdValid };
