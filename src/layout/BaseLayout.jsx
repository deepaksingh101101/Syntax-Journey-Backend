import { Outlet } from "react-router-dom";
// import { AreaTop, Sidebar } from "../components";
import { useContext } from "react";
import './BaseLayout.css'
import { ThemeContext } from "../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";
import MoonIcon from "../assets/icons/moon.svg";
import SunIcon from "../assets/icons/sun.svg";
import { useEffect } from "react";
import { Sidebar } from "../components";

const BaseLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);
  return (
    <main className="page-wrapper">
      {/* left of page */}
      <Sidebar />
      {/* right side/content of the page */}
      {/* <AreaTop/> */}
      <div className="content-wrapper p-2 outlet_outer d-flex   ">
        <Outlet />
      </div>
      {/* <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
            alt=""
          />
        </button> */}
        
    </main>
  );
};

export default BaseLayout;
