import "../styles/Footer.css";

function Footer() {

  return (

    <footer className="footer" id="contact">

      <div className="footerContainer">

        <div className="footerBrand">

          <h2>
            Neuro<span>Scan</span> AI
          </h2>

          <p>
            AI-assisted brain tumor detection
            using MRI image analysis.
          </p>

        </div>


        <div className="footerLinks">

          <h3>Quick Links</h3>

          <a href="#home">Home</a>

          <a href="#features">Features</a>

          <a href="#diseases">Diseases</a>

          <a href="#how-it-works">How It Works</a>

        </div>


        <div className="footerLinks">

          <h3>Contact</h3>

          <p>Email: support@neuroscan.ai</p>

          <p>Available 24/7</p>

        </div>

      </div>


      <div className="footerBottom">

        <p>
          © 2026 NeuroScan AI. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;