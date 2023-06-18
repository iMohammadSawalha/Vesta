import { useEffect, useState } from "react";
import "./login.css";
import { notEmptyString } from "../helpers/global";
import { Link } from "react-router-dom";
import axios from "../api/axios";
const Login = () => {
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const LOGIN_URL = "/api/auth/login";

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
  const loginButtonHandle = async () => {
    setSubmitting(true);
    if (!notEmptyString.test(email)) return;
    if (!notEmptyString.test(password)) return;

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (error) {
      //For Testing Logs
      console.log(error);
      if (!error?.response) {
        console.log("No server response");
      } else if (error.response?.status === 401) {
        console.log("Invalid credentials");
      } else if (error.response?.status === 400) {
        console.log("Invalid input");
      } else {
        console.log("Login failed");
      }
    }
  };
  useEffect(() => {
    if (!notEmptyString.test(email) && submitting) {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }
    if (!notEmptyString.test(password) && submitting) {
      setErrorPassword(true);
    } else {
      setErrorPassword(false);
    }
  }, [email, password, submitting]);
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
            <div className="sign-in-title">Sign in</div>
            <div className="sign-in-subtitle">Log in to your account</div>
            <div className="email-input-container">
              <input
                className={
                  errorEmail
                    ? "login-input login-input-email input-error"
                    : "login-input login-input-email"
                }
                placeholder="Email"
                onChange={(e) => saveEmail(e.target.value)}
              />
              <div className="email-input-error-placeholder">
                {errorEmail && "Please enter an email"}
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
                onChange={(e) => savePassword(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div className="password-input-error-placeholder">
                {errorPassword && "Please enter an password"}
              </div>
              <div className="login-input-show-password" onClick={toggleHide}>
                Show Password
              </div>
            </div>
            <a className="forgot-password-link" href="">
              Forgot Password?
            </a>
            <button className="login-button" onClick={loginButtonHandle}>
              <span className="login-button-text">Sign in</span>
            </button>
            <div className="signup-alternative">
              Don't have an account?
              <a className="signup-alternative-link" href="/register">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
