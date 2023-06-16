import { useNavigate } from "react-router-dom";
import "./landing.css";
import { useEffect, useRef } from "react";
const Landing = () => {
  const containerRef = useRef(null);
  let createStarInterval;
  const navigate = useNavigate();
  useEffect(() => {
    createStarInterval = setInterval(createStar, 100);

    return () => {
      clearInterval(createStarInterval);
    };
  }, []);

  const createStar = () => {
    const container = containerRef.current;
    const top = Math.random() * window.innerHeight;
    const star = document.createElement("div");
    star.classList.add("star");
    container.appendChild(star);
    setInterval(() => runStar(star), 10);
    star.style.top = `${top}px`;
  };

  const runStar = (star) => {
    const right = parseFloat(star.style.right) || 0;
    if (right >= window.innerWidth) {
      star.remove();
    }
    star.style.right = `${right + 3}px`;
  };
  const navLogin = () => {
    navigate("/login");
  };
  const navRegister = () => {
    navigate("/register");
  };
  return (
    <div id="main-page-container" ref={containerRef}>
      <div className="text">
        <h1>Welcome to Vesta</h1>
        <hr />
        <div>What a better way to build products</div>
      </div>

      <div className="astronaut">
        <img
          src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png"
          alt=""
          className="src"
        />
      </div>
      <div className="landing-buttons-container">
        <button className="login-button landing-button" onClick={navLogin}>
          <span className="login-button-text">Login</span>
        </button>
        <button className="login-button landing-button" onClick={navRegister}>
          <span className="login-button-text">Register</span>
        </button>
      </div>
    </div>
  );
};
export default Landing;
