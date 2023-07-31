import { useEffect, useState } from "react";
import "./login.css";
import { isEmail, isPassword } from "../helpers/global";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./settings.css";
import userImage from "../assets/images/user.png";
import ImageCropModal from "../components/imageCrop";
import useAuth from "../hooks/useAuth";
import { LinearProgress } from "@mui/material";
const REGISTER_URL = "/api/user/register";
const Register = () => {
  const { auth, setAuth } = useAuth();
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [typing, setTyping] = useState(false);
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  //--------------
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleImageFileSelect = (event) => {
    setUploadedImage(URL.createObjectURL(event.target.files[0]));
  };
  useEffect(() => {
    document.title = "Profile";
  }, []);
  const openModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    document.title = "Create new account";
  }, []);
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
    if (loading) return;
    setLoading(true);
    setTyping(true);
    if (!isEmail.test(email)) return;
    if (!isPassword.test(password)) return;

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ email, password, image: imageData }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      setLoading(false);
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
        <h2 style={{ marginRight: "2rem", width: "100%", fontWeight: "400" }}>
          Create your new account
        </h2>
        <div>
          <ImageCropModal
            setUploadedImage={setUploadedImage}
            setImgSrc={setImageData}
            imageURL={uploadedImage || auth?.user?.image}
            open={open}
            setOpen={setOpen}
            handleFileSelect={handleImageFileSelect}
          />
          <div style={{ display: "flex", width: "100%", marginTop: "1rem" }}>
            <img
              style={{ marginLeft: "auto", marginRight: "auto" }}
              className="photo-upload-preview-img"
              src={imageData || auth?.user?.image || userImage}
              width={128}
              height={128}
              alt="upload-profile-image"
              onClick={openModal}
            />
          </div>
          <div className="profile-header">
            <div style={{ fontSize: "0.9em", color: "rgb(180,180,180)" }}>
              Upload your profile picture
            </div>
          </div>
          <div
            style={{
              marginTop: "2rem",
              height: "1px",
              backgroundColor: "rgb(120,120,120)",
            }}
          ></div>
        </div>
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
