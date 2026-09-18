import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="navbar-brand">

          <div className="navbar-brain">
            🧠
          </div>

          <div className="navbar-brand-text">
            <div className="navbar-brand-name">
              NeuroScan<span>.AI</span>
            </div>

            <div className="navbar-subtitle">
              Brain MRI Analysis
            </div>
          </div>

        </Link>


        {/* NAVIGATION */}
        <nav className="navbar-links">

          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Home
          </Link>

          <Link
            to="/upload"
            className={location.pathname === "/upload" ? "active" : ""}
          >
            Detection
          </Link>

          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            Dashboard
          </Link>

          <Link
            to="/history"
            className={location.pathname === "/history" ? "active" : ""}
          >
            History
          </Link>

          <a href="/#how-it-works">
            How It Works
          </a>

          <a href="/#about">
            About
          </a>

          <a href="/#contact">
            Contact
          </a>

        </nav>


        {/* LOGIN */}
        <Link to="/login" className="navbar-login">
          Login
        </Link>

      </div>
    </header>
  );
}

export default Navbar;