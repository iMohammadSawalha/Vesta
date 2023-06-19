import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import "./login.css";
import { notEmptyString } from "../helpers/global";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";

import axios from "../api/axios";
const LOGIN_URL = "/api/auth/login";
const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [hidden, setHidden] = useState(true);
  const [email, reset, emailAttrs] = useInput("email", "");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [check, toggleCheck] = useToggle("persist", false);

  // const saveEmail = (value) => {
  //   setEmail(value);
  // };
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
      const accessToken = response?.data?.accessToken;
      setAuth({ password, email, accessToken });
      navigate(from, { replace: true });
    } catch (error) {
      //For Testing Logs
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

  // useEffect(() => {
  //   localStorage.setItem("persist", persist);
  // }, [persist]);

  // const toggleStayLoggedIn = () => {
  //   setPersist((prev) => !prev);
  // };
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
            <div>Use this account for testing</div>
            <br />
            <span>Email: ahmad@mohsen.com</span>
            <span>Password: ahmad@mohsen</span>
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
                {...emailAttrs}
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
                {errorPassword && "Please enter a password"}
              </div>
              <div className="login-input-show-password" onClick={toggleHide}>
                Show Password
              </div>
            </div>
            <div className="stay-logged-in">
              <input
                type="checkbox"
                id="stay-logged-in"
                onChange={toggleCheck}
                checked={check}
              />
              <label htmlFor="stay-logged-in">Stay logged in ?</label>
            </div>
            <button className="login-button" onClick={loginButtonHandle}>
              <span className="login-button-text">Sign in</span>
            </button>
            <a className="forgot-password-link" href="">
              Forgot Password?
            </a>
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
