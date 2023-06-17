import { useEffect, useState } from "react";
import "./login.css";
import { isEmail, isPassword } from "../helpers/global";
import { Link } from "react-router-dom";
const Register = () => {
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [typing, setTyping] = useState(false);
  const saveEmail = (target) => {
    setEmail(target.value);
  };
  const savePassword = (target) => {
    setPassword(target.value);
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
  };
  useEffect(() => {
    if (!isEmail.test(email) && typing) {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }
    if (!isPassword.test(password) && typing) {
      setErrorPassword(true);
    } else {
      setErrorPassword(false);
    }
  }, [email, password, typing]);
  return (
    <div className="login">
      <div className="login-container">
        <div className="login-content">
          <div className="goback-link">
            <Link to={-1}>
              <div className="goback-link-container">Go Back</div>
            </Link>
          </div>
          <div className="loign-content-placeholder">
            <div className="sign-in-title">Register</div>
            <div className="sign-in-subtitle">Create a new account</div>
            <div className="email-input-container">
              <input
                className={
                  errorEmail
                    ? "login-input login-input-email input-error"
                    : "login-input login-input-email"
                }
                placeholder="Email"
                onChange={(e) => saveEmail(e.target)}
              />
              <div className="email-input-error-placeholder">
                {errorEmail && "Invalid email"}
              </div>
            </div>
            <div className="password-input-container">
              <input
                className={
                  errorPassword
                    ? "login-input login-input-password input-error"
                    : "login-input login-input-password"
                }
                placeholder="Passowrd"
                type={hidden ? "password" : "text"}
                onChange={(e) => savePassword(e.target)}
              />
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div className="password-input-error-placeholder">
                {errorPassword && "Password must be at least 8 characters"}
              </div>
              <div className="login-input-show-password" onClick={toggleHide}>
                Show Password
              </div>
            </div>
            <button className="login-button" onClick={loginButtonHandle}>
              <span className="login-button-text">Create new account</span>
            </button>
            <div className="signup-alternative">
              Already have an account?
              <a className="signup-alternative-link" href="/login">
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
