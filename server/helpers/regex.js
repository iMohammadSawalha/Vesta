const notEmptyString = /^(?!\s*$).+/;
const isEmail = /\S+@\S+\.\S+/;
const isPassword = /^[^\s]{8,}$/;
const isInteger = /^-?\d+$/;
const hasFirstTwoChars = /^[^\s]{2,}/;
module.exports = {
  notEmptyString,
  isEmail,
  isPassword,
  isInteger,
  hasFirstTwoChars,
};
