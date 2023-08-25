import "./cardMac.css";
const MacCard = ({ children }) => {
  return (
    <div class="card">
      <div class="tools">
        <div class="circle">
          <span class="red box"></span>
        </div>
        <div class="circle">
          <span class="yellow box"></span>
        </div>
        <div class="circle">
          <span class="green box"></span>
        </div>
      </div>
      <div class="card__content">{children}</div>
    </div>
  );
};
export default MacCard;
