const notEmptyString = /^(?!\s*$).+/;
const isEmail = /\S+@\S+\.\S+/;
const isPassword = /^[^\s]{8,}$/;
const isInteger = /^-?\d+$/;
module.exports = { notEmptyString, isEmail, isPassword, isInteger };
