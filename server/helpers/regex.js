const notEmptyString = /^(?!\s*$).+/;
const isEmail = /\S+@\S+\.\S+/;
const isPassword = /^[^\s]{8,}$/;

module.exports = { notEmptyString, isEmail, isPassword };
