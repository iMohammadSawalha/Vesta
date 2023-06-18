import { useEffect, useRef } from "react";
import "../views/landing.css";
const Loading = () => {
  const containerRef = useRef(null);
  let createStarInterval;
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
  return (
    <div id="main-page-container" ref={containerRef}>
      <div className="text">
        <div>Please Wait</div>
        <h1>Loading...</h1>
        <hr />
      </div>

      <div className="astronaut">
        <img
          src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png"
          alt=""
          className="src"
        />
      </div>
    </div>
  );
};
export default Loading;
