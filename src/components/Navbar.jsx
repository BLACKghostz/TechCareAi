
import { Link, NavLink } from "react-router-dom";
import { Bot, Menu, ArrowRight } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white py-3 border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="brand-icon">
            <Bot size={25} />
          </div>
          <span className="brand-name">
            TechCare<span>AI</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-label="Toggle navigation"
        >
          <Menu size={24} />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav mx-auto gap-lg-4">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            <a className="nav-link" href="#services">
              Services
            </a>
            <a className="nav-link" href="#how-it-works">
              How It Works
            </a>
            <a className="nav-link" href="#about">
              About
            </a>
            <NavLink className="nav-link" to="/inventory">
              Inventory
            </NavLink>
            <NavLink className="nav-link" to="/orders">
              Orders
            </NavLink>
            <NavLink className="nav-link" to="/admin">
              Admin
            </NavLink>
          </div>

          <div className="d-flex gap-2 mt-3 mt-lg-0">
            <Link to="/chat" className="btn btn-primary rounded-pill px-4">
              Start AI Support <ArrowRight size={17} className="ms-1" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
