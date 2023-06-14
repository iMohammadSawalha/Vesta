import { useEffect, useState } from "react";
import "./login.css";
import { notEmptyString } from "../helpers/global";
const Register = () => {
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [typing, setTyping] = useState(false);
  const saveEmail = (value) => {
    setEmail(value);
  };
  const savePassword = (value) => {
    setPassword(value);
  };
  const toggleHide = (e) => {
    if (hidden) {
      setHidden(false);
      e.target.innerHTML = "Hide Password";
    } else {
      setHidden(true);
      e.target.innerHTML = "Show Password";
    }
  };
  const loginButtonHandle = () => {
    setTyping(true);
    // if (!notEmptyString.test(email))
    // if (!notEmptyString.test(password))
  };
  useEffect(() => {
    if (!notEmptyString.test(email) && typing) {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }
    if (!notEmptyString.test(password) && typing) {
      setErrorPassword(true);
    } else {
      setErrorPassword(false);
    }
  }, [email, password, typing]);
  return (
    <div className="login">
      <div className="login-container">
        <div className="login-content">
          <div className="loign-content-placeholder">
            <div className="sign-in-title">Register</div>
            <div className="sign-in-subtitle">Create a new account</div>
            <input
              className={
                errorEmail
                  ? "login-input login-input-email input-error"
                  : "login-input login-input-email"
              }
              placeholder="Email"
              onChange={(e) => saveEmail(e.target.value)}
            />
            <input
              className={
                errorPassword
                  ? "login-input login-input-password input-error"
                  : "login-input login-input-password"
              }
              placeholder="Passowrd"
              type={hidden ? "password" : "text"}
              onChange={(e) => savePassword(e.target.value)}
            />
            <div className="login-input-show-password" onClick={toggleHide}>
              Show Password
            </div>
            <button className="login-button" onClick={loginButtonHandle}>
              <span className="login-button-text">Create new account</span>
            </button>
            <div className="signup-alternative">
              Already have an account?
              <a className="signup-alternative-link" href="">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
