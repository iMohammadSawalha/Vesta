import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import "./login.css";
import "../components/buttons.css";
import { notEmptyString } from "../helpers/global";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";

import axios from "../api/axios";
import { LinearProgress, Snackbar } from "@mui/material";
const LOGIN_URL = "/api/auth/login";
const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const [hidden, setHidden] = useState(true);
  const [email, reset, emailAttrs] = useInput("email", "");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [check, toggleCheck] = useToggle("persist", false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const closeErrorMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setErrorLogin(false);
  };
  const savePassword = (value) => {
    setPassword(value);
  };
  const toggleHide = (e) => {
    if (hidden) {
      setHidden(false);
      e.target.innerHTML = "Hide";
    } else {
      setHidden(true);
      e.target.innerHTML = "Show";
    }
  };
  const loginButtonHandle = async () => {
    setSubmitting(true);
    if (!notEmptyString.test(email)) return;
    if (!notEmptyString.test(password)) return;

    try {
      if (loading) return;
      setLoading(true);
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      setAuth({
        accessToken,
        workspaces: response?.data?.workspaces,
        defaultWorkspace: response?.data?.defaultWorkspace,
      });
      navigate("/", { replace: true });
    } catch (error) {
      //For Testing Logs
      if (!error?.response) {
        setErrorMessage("No server response");
      } else if (error.response?.status === 401) {
        setErrorMessage("Invalid credentials");
      } else if (error.response?.status === 400) {
        setErrorMessage("Invalid input");
      } else {
        setErrorMessage("Login failed");
      }
      setLoading(false);
      setErrorLogin(true);
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
  useEffect(() => {
    if (auth?.accessToken) navigate(from, { replace: true });
  }, []);
  return (
    <div className="auth-container">
      {loading && (
        <div
          style={{
            width: "100%",
            position: "absolute",
            bottom: "0%",
            color: "#645bff",
          }}
        >
          <LinearProgress color="inherit" />
        </div>
      )}
      <Snackbar
        open={errorLogin}
        onClose={closeErrorMessage}
        autoHideDuration={6000}
        message={errorMessage}
      />
      <div className="auth-content">
        <h2 style={{ marginRight: "2rem", width: "100%", fontWeight: "400" }}>
          Login
        </h2>
        <input
          className={
            errorEmail
              ? "auth-input auth-input-email input-error"
              : "auth-input auth-input-email"
          }
          placeholder="Email"
          {...emailAttrs}
        />
        <div className="email-input-error-placeholder">
          {errorEmail && "Please enter an email"}
        </div>
        <input
          className={
            errorPassword
              ? "auth-input auth-input-password input-error"
              : "auth-input auth-input-password"
          }
          placeholder="Passowrd"
          type={hidden ? "password" : "text"}
          onChange={(e) => savePassword(e.target.value)}
        />
        <div className="passowrd-input-footer">
          <div className="password-input-error-placeholder">
            {errorPassword && "Please enter a password"}
          </div>
          <div className="input-show-password" onClick={toggleHide}>
            Show
          </div>
        </div>
        <div className="stay-logged-in-checkbox-container">
          <div className="cntr">
            <input
              type="checkbox"
              id="cbx"
              className="hidden-xs-up"
              checked={check}
              onChange={toggleCheck}
            />
            <label htmlFor="cbx" className="cbx"></label>
          </div>
          <label>Stay Logged In?</label>
        </div>
        <button
          className="auth-button slide-center-button"
          onClick={loginButtonHandle}
        >
          Sign in
        </button>
        <div className="link-res forgot-passowrd-link">
          <Link to="#">Forgot Passowrd ?</Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
