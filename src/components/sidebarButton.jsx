import { Link } from "react-router-dom";

const SidebarButton = ({ icon, to, content, action, style }) => {
  return (
    <div className="sidebar-button" style={style}>
      <Link to={to}>
        <div className="sidebar-button-content" onClick={action}>
          {icon}
          <div className="sidebar-button-text">{content}</div>
        </div>
      </Link>
    </div>
  );
};
export default SidebarButton;
