import { Sidebar } from "./icons";

const Navbar = ({ sidebarToggler, sidebarActive }) => {
  return (
    <div className="navbar-container">
      <div
        className={
          sidebarActive
            ? "sidebar-toggle-button-container active"
            : "sidebar-toggle-button-container"
        }
      >
        <button className="add-card-issue-button" onClick={sidebarToggler}>
          <Sidebar />
        </button>
      </div>
    </div>
  );
};
export default Navbar;
