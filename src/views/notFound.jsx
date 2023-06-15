import { useEffect, useRef } from "react";
import "./notFound.css";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
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
    const right = Math.random() * 500;
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
  const goHome = () => {
    navigate("/");
  };
  return (
    <div id="not-found-container" ref={containerRef}>
      <div className="text">
        <div>ERROR</div>
        <h1>404</h1>
        <hr />
        <div>Page Not Found</div>
      </div>

      <div className="astronaut">
        <img
          src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png"
          alt=""
          className="src"
        />
      </div>
      <div className="not-found-buttons-container">
        <button className="login-button" onClick={goHome}>
          <span className="login-button-text">Home</span>
        </button>
      </div>
    </div>
  );
};
export default NotFound;
