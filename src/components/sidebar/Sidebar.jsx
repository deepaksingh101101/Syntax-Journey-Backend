import { useContext, useEffect, useRef} from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import mytrLogo from "../../assets/images/mytr.png"
// import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import {
  MdOutlineAttachMoney,
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineMessage,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {

  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  
  let authUserData= JSON.parse(localStorage.getItem('user'))?.user?.isSuperAdmin

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 
  const navigate=useNavigate()

  const handleLogout=()=>{
    localStorage.clear();
    navigate('/')

  }


  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={mytrLogo} alt="" />
          {/* <span className="sidebar-brand-text">tabernam.</span> */}
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list p-0">
            <li className="menu-item">
              <NavLink to="/das"  className="menu-link text-decoration-none" >
                <span className="menu-link-icon">
                <i className="fa-brands fa-wpforms"></i>
                </span>
                <span className="menu-link-text">Create Consent Form</span>
              </NavLink>
            </li>
           {authUserData && <li className="menu-item">
              <NavLink to="/create-template" className="menu-link text-decoration-none">
                <span className="menu-link-icon">
                <i className="fa-solid fa-file-pen"></i>
                </span>
                <span className="menu-link-text">Create Template</span>
              </NavLink>
            </li>}
            <li className="menu-item" >
              <NavLink to="/consentList" className="menu-link text-decoration-none">
                <span className="menu-link-icon">
                <i className="fa-solid fa-file-waveform"></i>
                </span>
                <span className="menu-link-text">View Consent Form</span>
              </NavLink>
            </li>
           {authUserData && <li className="menu-item" >
              <NavLink to="/templateList" className="menu-link text-decoration-none">
                <span className="menu-link-icon">
                <i className="fa-solid fa-newspaper"></i>
                </span>
                <span className="menu-link-text">View Template</span>
              </NavLink>
            </li>}
           {authUserData && <li className="menu-item" >
              <NavLink to="/stats" className="menu-link text-decoration-none">
                <span className="menu-link-icon">
                <i className="fa-solid fa-user-tie"></i>
                </span>
                <span className="menu-link-text">Stats</span>
              </NavLink>
            </li>}
           {authUserData && <li className="menu-item" >
              <NavLink to="/createAdmin" className="menu-link text-decoration-none">
                <span className="menu-link-icon">
                <i className="fa-solid fa-user-tie"></i>
                </span>
                <span className="menu-link-text">Create Admin</span>
              </NavLink>
            </li>}
           {authUserData && <li className="menu-item" >
              <NavLink to="/viewAdmin" className="menu-link text-decoration-none">
                <span className="menu-link-icon">
                <i className="fa-solid fa-users-line"></i>
                </span>
                <span className="menu-link-text">View Admin List</span>
              </NavLink>
            </li>}
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list p-0">
            {/* <li className="menu-item">
              <NavLink to="/" className="menu-link text-decoration-none">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </NavLink>
            </li> */}
            <li className="menu-item" onClick={handleLogout}>
              <NavLink to="/" className="menu-link text-decoration-none">
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
