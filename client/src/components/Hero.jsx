import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";
import mriHero from "../assets/mri-hero.png";

function Hero() {

  const navigate = useNavigate();

  return (
    <section className="hero-section">

      <div className="hero-image">
        <img
          src={mriHero}
          alt="MRI machine and patient"
        />
      </div>

      <div className="hero-image-fade"></div>

      <div className="hero-container">

        <div className="hero-content">

          <div className="hero-label">
            AI POWERED
          </div>

          <h1>
            Brain Tumor
            <br />
            <span>Detection</span>
          </h1>

          <p className="hero-description">
            Upload your MRI scan and let our AI analyze it
            <br />
            for early and accurate detection.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/upload")}
            >
              <span>⇧</span>
              Upload MRI Scan
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/upload")}
            >
              <span>▣</span>
              Live Capture
            </button>

          </div>


          {/* ================= STATS ================= */}

          <div className="hero-stats">

            <div className="stat-box">
              <strong>96.87%</strong>
              <span>Model Accuracy</span>
            </div>

            <div className="stat-box">
              <strong>4</strong>
              <span>Tumor Classes</span>
            </div>

            <div className="stat-box">
              <strong>1K+</strong>
              <span>Scans Analyzed</span>
            </div>

            <div className="stat-box">
              <strong>24/7</strong>
              <span>Expert Support</span>
            </div>

          </div>


          <div className="hero-security">
            <span>🛡</span>
            Your data is secure and confidential
          </div>

        </div>


        {/* HANDWRITTEN MESSAGE */}

        <div className="hero-message">
          <span>Smarter</span>
          <span>Diagnosis</span>
          <span>Healthier</span>
          <span>Tomorrows</span>
          <i></i>
        </div>

      </div>

    </section>
  );
}

export default Hero;