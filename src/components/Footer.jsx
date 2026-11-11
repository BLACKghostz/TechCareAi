
import { Bot, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="row g-4 py-5">

          <div className="col-lg-5">
            <Link to="/" className="footer-brand">
              <Bot size={27} />
              TechCare<span>AI</span>
            </Link>

            <p className="footer-description mt-3">
              Intelligent computer support powered by AI.
              Making technical assistance smarter, simpler
              and accessible around the clock.
            </p>
          </div>

          <div className="col-6 col-lg-3">
            <h6>Explore</h6>
            <a href="#services">Our Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About Us</a>
          </div>

          <div className="col-6 col-lg-4">
            <h6>Support</h6>
            <Link to="/chat">AI Technical Support <ArrowUpRight size={14}/></Link>
            <a href="mailto:support@techcareai.example">
              Contact Support <Mail size={14}/>
            </a>
            <a href="#services">Computer Services</a>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TechCare AI. All rights reserved.</span>
           <span>Powered by Intelligent Technology</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
