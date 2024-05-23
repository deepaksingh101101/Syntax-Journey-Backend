

import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../../../context/SidebarContext";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";


const AreaTop = ({title}) => {
  const { openSidebar } = useContext(SidebarContext);

  return (
    <section className="content-area-top">
      <div className="area-top-l d-flex align-items-center gap-3 ">
        <button
          className="sidebar-open-btn d-block d-md-block d-lg-block d-xl-none"
          type="button"
          onClick={openSidebar}
        >
          <i className="fa-solid fa-bars fs-2"></i>
        </button>
        <h2 className="area-top-title w-100 text-center ">{title}</h2>
      </div>
    </section>
  );
};

export default AreaTop;
