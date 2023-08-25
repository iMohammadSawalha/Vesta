import Background from "../components/landingBackground";
import "./landing.css";
import "../components/buttons.css";
import Spline from "@splinetool/react-spline";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import MacCard from "../components/cardMac";
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
      <Background>
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
          <div className="text-content">
            <div className="text-container">
              <div class="header">
                <h1>Vesta</h1>
                <p>Efficient Issue and Ticket Management for Teams</p>
              </div>
              <div className="description">
                Streamline your team's workflow with Vesta - the ultimate
                solution for managing issues and tickets. Assign tasks, track
                progress, and collaborate seamlessly.
              </div>
              <div className="cards-container">
                <MacCard>
                  <div style={{ fontSize: "1.2em", marginBottom: "10px" }}>
                    Real-time Tracking
                  </div>
                  Track the status of each issue in real time. Know what's being
                  worked on and what's resolved.
                </MacCard>
                <MacCard>
                  <div style={{ fontSize: "1.2em", marginBottom: "10px" }}>
                    Easy Assignment
                  </div>
                  Assign issues to team members with just a few clicks. Keep
                  everyone on the same page.
                </MacCard>
              </div>
            </div>
          </div>
          <div className="spline-container">
            <Spline
              className="splineObject"
              scene="https://prod.spline.design/z4WAks3qdqLhX0yD/scene.splinecode"
            />
          </div>
        </div>
      </Background>
    );
};
export default Landing;
