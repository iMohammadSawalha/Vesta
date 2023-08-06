const isString = (...params) => {
  for (const param of params) {
    if (typeof param !== "string") return false;
  }
  return true;
};
function hasOtherKeys(obj, allowedKeys) {
  const keys = Object.keys(obj);
  return keys.some((key) => !allowedKeys.includes(key));
}
const isNumber = (...params) => {
  for (const param of params) {
    if (typeof param !== "number") return false;
  }
  return true;
};
module.exports = { isString, isNumber, hasOtherKeys };
