import { useEffect, useState } from "react";
import "./login.css";
import { isEmail, isPassword } from "../helpers/global";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
const REGISTER_URL = "/api/auth/register";
const Register = () => {
  const { auth } = useAuth();
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [typing, setTyping] = useState(false);
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const saveEmail = (target) => {
    setEmail(target.value);
    setErrorEmail(false);
  };
  const savePassword = (target) => {
    setPassword(target.value);
    setErrorPassword(false);
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
  const registerButtonHandle = async () => {
    setTyping(true);
    if (!isEmail.test(email)) return;
    if (!isPassword.test(password)) return;

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      //For Testing Logs
      if (!error?.response) {
        console.log("No server response");
      } else if (error.response?.status === 409) {
        console.log("A user already exists with that email");
      } else if (error.response?.status === 400) {
        console.log("Invalid Input");
      } else {
        console.log("Registration Failed");
      }
    }
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
  useEffect(() => {
    if (auth?.accessToken) navigate(from, { replace: true });
  }, []);
  return (
    <div className="auth-container">
      <div className="auth-content">
        <h2 style={{ marginRight: "2rem", width: "100%", fontWeight: "400" }}>
          Create your new account
        </h2>
        <input
          className={
            errorEmail
              ? "auth-input auth-input-email input-error"
              : "auth-input auth-input-email"
          }
          placeholder="Email"
          onChange={(e) => saveEmail(e.target)}
        />
        <div className="email-input-error-placeholder">
          {errorEmail && "Please enter a valid email"}
        </div>
        <input
          className={
            errorPassword
              ? "auth-input auth-input-password input-error"
              : "auth-input auth-input-password"
          }
          placeholder="Passowrd"
          type={hidden ? "password" : "text"}
          onChange={(e) => savePassword(e.target)}
        />
        <div className="passowrd-input-footer">
          <div className="password-input-error-placeholder">
            {errorPassword && "Password must be at least 8 characters"}
          </div>
          <div className="input-show-password" onClick={toggleHide}>
            Show
          </div>
        </div>
        <button
          className="auth-button slide-center-button"
          onClick={registerButtonHandle}
        >
          Create new account
        </button>
      </div>
    </div>
  );
};
export default Register;
