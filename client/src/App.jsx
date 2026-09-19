import { useState } from "react";
import axios from "axios";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

import Navbar from "./components/Navbar";

import "./index.css";
import "./styles/UploadPage.css";
import "./styles/ResultPage.css";
import "./styles/AuthPage.css";


/* =========================================================
   UPLOAD / DETECTION PAGE
   ========================================================= */

function UploadPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cameraCaptured, setCameraCaptured] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setCameraCaptured(false);

    const imageURL = URL.createObjectURL(selectedFile);
    setPreview(imageURL);
  };


  const handleCameraCapture = () => {
    alert(
      "Live camera capture is currently available for image capture. Please use a saved MRI image for AI analysis."
    );

    setCameraCaptured(true);
  };


  const analyzeMRI = async () => {
    if (!file) {
      alert("Please select an MRI image first.");
      return;
    }

    if (cameraCaptured) {
      alert(
        "Please upload an actual brain MRI scan for AI analysis."
      );
      return;
    }

    try {
      setAnalyzing(true);

      const formData = new FormData();
      formData.append("image", file);

    const response = await axios.post(
  "https://neuroscan-ai-4glb.onrender.com/predict",
  formData
);

      if (response.data?.success) {
        navigate("/result", {
          state: {
            result: response.data,
            preview: preview,
          },
        });
      } else {
        alert(
          response.data?.error ||
            "Unable to analyze the MRI image."
        );
      }
    } catch (error) {
      console.error("Prediction error:", error);

      alert(
        "Unable to connect to the NeuroScan.AI backend. Make sure the Flask server is running."
      );
    } finally {
      setAnalyzing(false);
    }
  };


  return (
    <>
      <Navbar />

      <div className="upload-page">

        <main className="upload-main">

          {/* =================================================
              TITLE
              ================================================= */}

          <div className="upload-title">

            <div className="upload-label">
              AI POWERED DETECTION
            </div>

            <h1>
              Brain MRI <span>Analysis</span>
            </h1>

            <p>
              Upload your brain MRI scan and let our trained
              AI model analyze it for tumor classification.
            </p>

          </div>


          {/* =================================================
              MAIN CARD
              ================================================= */}

          <div className="upload-card">

            {/* CARD HEADER */}

            <div className="upload-card-header">

              <div>
                <h2>
                  Upload MRI Scan
                </h2>

                <p>
                  Select a clear brain MRI image in JPG, JPEG
                  or PNG format.
                </p>
              </div>

              <div className="upload-card-badge">
                ♢ Secure
              </div>

            </div>


            {/* =================================================
                UPLOAD AREA
                ================================================= */}

            {!preview ? (

              <div
                className="upload-drop-area"
                onClick={(event) => {
                  if (
                    event.target.tagName !== "INPUT" &&
                    event.target.tagName !== "LABEL"
                  ) {
                    const input =
                      document.getElementById(
                        "mri-file-input"
                      );

                    if (input) {
                      input.click();
                    }
                  }
                }}
              >

                <div className="upload-drop-icon">
                  🧠
                </div>

                <h3>
                  Upload your MRI scan
                </h3>

                <p>
                  Drag and drop your MRI image here
                </p>

                <label className="browse-btn">

                  Browse MRI Image

                  <input
                    id="mri-file-input"
                    className="hidden-file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleFileChange}
                  />

                </label>

                <div className="supported-text">
                  Supported formats: JPG, JPEG, PNG
                </div>

              </div>

            ) : (

              <div className="selected-section">

                {/* SELECTED HEADER */}

                <div className="selected-header">

                  <div>

                    <span>
                      MRI SCAN SELECTED
                    </span>

                    <h3>
                      {file?.name}
                    </h3>

                  </div>


                  <label className="change-btn">

                    Change

                    <input
                      className="hidden-file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleFileChange}
                    />

                  </label>

                </div>


                {/* MRI PREVIEW */}

                <div className="preview-box">

                  <img
                    src={preview}
                    alt="MRI Preview"
                  />

                </div>


                {/* READY MESSAGE */}

                <div className="mri-ready">

                  <div className="ready-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      MRI scan ready for analysis
                    </strong>

                    <span>
                      {file?.name}
                    </span>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                ACTION BUTTONS
                ================================================= */}

            <div className="upload-actions">

              <button
                className="live-capture-btn"
                onClick={handleCameraCapture}
                type="button"
              >
                ▣ Live Capture
              </button>


              <button
                className="analyze-btn"
                onClick={analyzeMRI}
                disabled={!file || analyzing}
                type="button"
              >
                {analyzing
                  ? "Analyzing..."
                  : "♟ Analyze MRI →"}
              </button>

            </div>


            {/* =================================================
                FEATURE STRIP
                ================================================= */}

            <div className="upload-features">

              <div className="upload-feature">

                <div className="upload-feature-icon">
                  🧠
                </div>

                <div>

                  <strong>
                    AI Analysis
                  </strong>

                  <p>
                    Trained deep learning model analyzes
                    your MRI scan.
                  </p>

                </div>

              </div>


              <div className="upload-feature">

                <div className="upload-feature-icon">
                  ⚡
                </div>

                <div>

                  <strong>
                    Fast Results
                  </strong>

                  <p>
                    Receive prediction and class
                    probabilities after analysis.
                  </p>

                </div>

              </div>


              <div className="upload-feature">

                <div className="upload-feature-icon">
                  ♢
                </div>

                <div>

                  <strong>
                    Secure
                  </strong>

                  <p>
                    Your scan is handled through the
                    analysis request.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              DISCLAIMER
              ================================================= */}

          <div className="upload-disclaimer">

            <strong>
              Important:
            </strong>

            This AI system is intended for research and
            educational assistance and should not replace
            professional medical diagnosis.

          </div>

        </main>

      </div>
    </>
  );
}


/* =========================================================
   RESULT PAGE
   ========================================================= */

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.result;
  const preview = location.state?.preview;


  /* NO RESULT */

  if (!result) {

    return (
      <>
        <Navbar />

        <div className="result-empty">

          <div className="result-empty-card">

            <div className="result-empty-icon">
              🧠
            </div>

            <h2>
              No Analysis Result
            </h2>

            <p>
              Please upload an MRI scan first.
            </p>

            <button
              onClick={() => navigate("/upload")}
            >
              Upload MRI
            </button>

          </div>

        </div>
      </>
    );
  }


  const prediction =
    result.prediction || "Unknown";

  const confidence =
    Number(result.confidence || 0);

  const probabilities =
    result.probabilities || {};


  return (
    <>
      <Navbar />

      <div className="result-page">

        <div className="result-card">

          <div className="result-brand">
            NeuroScan<span>.AI</span>
          </div>

          <div className="result-label">
            MRI ANALYSIS RESULT
          </div>

          <h1>
            AI-Assisted MRI Classification
          </h1>


          {/* MRI IMAGE */}

          {preview && (

            <div className="result-image-box">

              <img
                src={preview}
                alt="Uploaded MRI"
              />

            </div>

          )}


          {/* PREDICTION */}

          <div className="prediction-box">

            <span>
              PREDICTION
            </span>

            <h2>
              {prediction}
            </h2>

            <p>
              Confidence:{" "}
              <strong>
                {confidence.toFixed(2)}%
              </strong>
            </p>

          </div>


          {/* PROBABILITIES */}

          <div className="probability-section">

            <h3>
              Class Probabilities
            </h3>


            {Object.entries(probabilities).map(
              ([className, probability]) => (

                <div
                  className="probability-row"
                  key={className}
                >

                  <span>
                    {className}
                  </span>

                  <strong>
                    {Number(probability).toFixed(2)}%
                  </strong>

                </div>

              )
            )}

          </div>


          {/* WARNING */}

          <div className="result-warning">

            <strong>
              Medical Notice
            </strong>

            <p>
              This result is an AI-assisted
              classification and is not a medical
              diagnosis. Consult a qualified medical
              professional for clinical interpretation.
            </p>

          </div>


          {/* ACTIONS */}

          <div className="result-actions">

            <button
              className="result-primary"
              onClick={() => navigate("/upload")}
            >
              Analyze Another MRI
            </button>

            <button
              className="result-secondary"
              onClick={() => navigate("/history")}
            >
              View History
            </button>

          </div>

        </div>

      </div>
    </>
  );
}


/* =========================================================
   LOGIN PAGE
   ========================================================= */

function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = (event) => {

    event.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    alert(
      "Login system will be connected to the database later."
    );

    navigate("/dashboard");
  };


  return (
    <>
      <Navbar />

      <div className="authPage">

        <div className="authCard">

          <div className="authLogo">
            🧠
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to NeuroScan.AI
          </p>


          <form onSubmit={handleLogin}>

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />


            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />


            <button
              type="submit"
              className="authButton"
            >
              Login
            </button>

          </form>


          <p className="authSwitch">

            Don't have an account?{" "}

            <Link to="/signup">
              Sign Up
            </Link>

          </p>

        </div>

      </div>
    </>
  );
}


/* =========================================================
   SIGNUP PAGE
   ========================================================= */

function SignupPage() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignup = (event) => {

    event.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    alert(
      "Account creation will be connected to the database later."
    );

    navigate("/login");
  };


  return (
    <>
      <Navbar />

      <div className="authPage">

        <div className="authCard">

          <div className="authLogo">
            🧠
          </div>

          <h1>
            Create Account
          </h1>

          <p>
            Join NeuroScan.AI
          </p>


          <form onSubmit={handleSignup}>

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />


            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />


            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />


            <button
              type="submit"
              className="authButton"
            >
              Create Account
            </button>

          </form>


          <p className="authSwitch">

            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </div>
    </>
  );
}


/* =========================================================
   APPLICATION
   ========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* DETECTION */}

        <Route
          path="/upload"
          element={<UploadPage />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />


        {/* HISTORY */}

        <Route
          path="/history"
          element={
            <>
              <Navbar />
              <History />
            </>
          }
        />


        {/* RESULT */}

        <Route
          path="/result"
          element={<ResultPage />}
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* SIGNUP */}

        <Route
          path="/signup"
          element={<SignupPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;