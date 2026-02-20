import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [openReports, setOpenReports] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openCMS, setOpenCMS] = useState(false);
  const [openMaster, setOpenMaster] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const menuItem = (path: string, label: string, icon: string) => (
    <Link
      to={path}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 18px",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: isActive(path) ? 600 : 400,
        color: isActive(path) ? "#2563EB" : "#2E2E2E",
        background: isActive(path) ? "#E8F0FE" : "transparent",
        textDecoration: "none",
      }}
    >
      <img src={icon} alt="" style={{ width: 20, height: 20 }} />
      {label}
    </Link>
  );

  const dropdownItem = (label: string, icon: string, isOpen: boolean, setOpen: (v: boolean) => void) => (
    <div
      onClick={() => setOpen(!isOpen)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "18px",
        color: "#2E2E2E",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <img src={icon} alt="" style={{ width: 20, height: 20 }} />
        {label}
      </div>
      <span style={{ fontSize: "12px" }}>{isOpen ? "▲" : "▼"}</span>
    </div>
  );

  const sectionTitle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#000",
    padding: "0 24px",
    marginBottom: "10px",
    textTransform: "uppercase",
  };

  return (
    <div style={{ 
      width: "310px", 
      background: "#F9FAFB", 
      height: "100vh", 
      borderRight: "1px solid #E5E7EB", 
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      {/* Logo Section - Fixed at top */}
      <div style={{ padding: "25px 15px 20px" }}>
        <div style={{ padding: "0 24px 30px", borderBottom: "2px solid #DCDCDC" }}>
          <img src="/src/assets/images/rankup-logo.png" alt="logo" style={{ width: "180px", margin: "auto", alignContent: "center", alignItems: "center" }} />
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: "0 15px 25px",
        scrollbarWidth: "thin",
        scrollbarColor: "#E5E7EB transparent"
      }}>
        <div style={sectionTitle}>Main</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {menuItem("/home", "Dashboard", "/src/assets/icons/dashboard.png")}
          {menuItem("/home/users", "Users", "/src/assets/icons/users.png")}
          {menuItem("/home/exams-management", "Exams Management", "/src/assets/icons/exams.png")}
          {menuItem("/home/subscriptions", "Subscriptions", "/src/assets/icons/subscription.png")}
          {menuItem("/home/coupon", "Coupon", "/src/assets/icons/coupon.png")}
          {/* {menuItem("/home/daily-video", "Daily Motivational Video", "/src/assets/icons/video.png")} */}
        </div>
        
        {/* MASTER */}
        <div style={sectionTitle}>Master</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {dropdownItem("Master", "/src/assets/icons/dashboard.png", openMaster, setOpenMaster)}
          {openMaster && (
            <div style={{ paddingLeft: "42px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {menuItem("/home/master/languages", "Languages", "/src/assets/icons/dashboard.png")}
              {menuItem("/home/master/states", "States", "/src/assets/icons/dashboard.png")}
              {menuItem("/home/master/countries", "Countries", "/src/assets/icons/dashboard.png")}
              {menuItem("/home/master/categories", "Categories", "/src/assets/icons/dashboard.png")}
              {menuItem("/home/master/qualifications", "Qualifications", "/src/assets/icons/dashboard.png")}
              {menuItem("/home/master/streams", "Streams", "/src/assets/icons/dashboard.png")}
              {menuItem("/home/master/exams", "Exams", "/src/assets/icons/exams.png")}
            </div>
          )}
        </div>
        
        <div style={{ ...sectionTitle, marginTop: "30px" }}>Others</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {menuItem("/home/support", "Support", "/src/assets/icons/support.png")}
          {dropdownItem("Reports", "/src/assets/icons/reports.png", openReports, setOpenReports)}
          {dropdownItem("Settings", "/src/assets/icons/settings.png", openSettings, setOpenSettings)}
          {dropdownItem("CMS", "/src/assets/icons/cms.png", openCMS, setOpenCMS)}
          {openCMS && (
            <div style={{ paddingLeft: "42px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {menuItem("/home/cms", "Content Management", "/src/assets/icons/cms.png")}
            </div>
          )}
          {menuItem("/login", "Logout", "/src/assets/icons/logout.png")}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
