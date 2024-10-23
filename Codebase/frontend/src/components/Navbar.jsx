import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Destin</span>
          <span className="logo-accent">Ease</span>
          <span className="logo-dot"></span>
        </Link>

        {user ? (
          <div className="nav-items">
            <div className="nav-links">
              <Link
                to="/preferences"
                className={`nav-link ${
                  location.pathname === "/preferences" ? "active" : ""
                }`}
              >
                <span className="nav-link-text">Preferences</span>
                <span className="nav-link-indicator"></span>
              </Link>
              <Link
                to="/recommendations"
                className={`nav-link ${
                  location.pathname === "/recommendations" ? "active" : ""
                }`}
              >
                <span className="nav-link-text">Recommendations</span>
                <span className="nav-link-indicator"></span>
              </Link>
            </div>
            <button onClick={handleLogout} className="btn-nav">
              <span>Logout</span>
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="nav-items">
            <Link to="/login" className="btn-nav btn-nav-secondary">
              <span>Sign In</span>
            </Link>
            <Link to="/register" className="btn-nav btn-nav-primary">
              <span>Get Started</span>
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
