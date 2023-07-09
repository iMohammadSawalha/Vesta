import StarsBackground from "../components/landingBackgroundStars";
import "./landing.css";
import "../components/buttons.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
const Landing = () => {
  const [redirecting, setRedirecting] = useState(true);
  const navigate = useNavigate();
  const { auth } = useAuth();
  useEffect(() => {
    document.title = "Vesta";
    if (auth.accessToken) return navigate("/workspace/default");
    setRedirecting(false);
  }, []);

  if (!redirecting)
    return (
      <StarsBackground>
        <div className="landing-container">
          <div className="landing-navbar">
            <div className="landing-navbar-buttons">
              <button
                className="login-sliding-button"
                onClick={() => navigate("/login")}
              >
                <span>LOGIN</span>
              </button>
              <button
                className="signup-arrow-button"
                onClick={() => navigate("/register")}
              >
                <span>SIGN UP</span>
                <div className="arrow-wrapper">
                  <div className="arrow"></div>
                </div>
              </button>
            </div>
          </div>
          <div className="landing-content">
            <div className="landing-title">Vesta</div>
            <div className="landing-subtitle">
              What a better way to build products
            </div>
          </div>
        </div>
      </StarsBackground>
    );
};
export default Landing;
