import Validator from "validator";
module.exports = function validateSignIn(data: any) {
  let errors: any = {};

  data.email = data.email || "";
  data.password = data.password || "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  return {
    errors,
    isValid: errors
  };
};