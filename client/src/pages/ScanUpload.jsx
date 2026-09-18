import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ScanUpload.css";

function ScanUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid MRI image.");
      return;
    }

    setFile(selectedFile);

    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("Please select an MRI scan first.");
      return;
    }

    navigate("/result", {
      state: {
        file: file,
        preview: preview,
      },
    });
  };

  return (
    <div className="scan-upload-page">

      {/* ================= NAVBAR ================= */}

      <header className="upload-navbar">

        <button
          className="upload-back"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <div className="upload-brand">
          <div className="upload-brand-icon">
            🧠
          </div>

          <div>
            <strong>
              NeuroScan<span>.AI</span>
            </strong>

            <small>
              Brain MRI Analysis
            </small>
          </div>
        </div>

        <div className="upload-secure">
          🛡 Secure & Confidential
        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="upload-main">

        <section className="upload-heading">

          <div className="upload-label">
            AI POWERED DETECTION
          </div>

          <h1>
            Upload Your <span>MRI Scan</span>
          </h1>

          <p>
            Upload a brain MRI image and let NeuroScan.AI
            analyze it using our trained AI model.
          </p>

        </section>


        {/* ================= CARD ================= */}

        <section className="upload-card">

          {!file ? (

            <label className="drop-zone">

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />

              <div className="upload-big-icon">
                ⇧
              </div>

              <h2>
                Upload your MRI scan
              </h2>

              <p>
                Drag and drop your MRI image here
                <br />
                or click to browse from your computer
              </p>

              <span className="browse-text">
                Browse MRI Image
              </span>

              <div className="supported-files">
                Supported formats: JPG, JPEG, PNG
              </div>

            </label>

          ) : (

            <div className="selected-area">

              {/* PREVIEW HEADER */}

              <div className="selected-header">

                <div>

                  <div className="selected-label">
                    SELECTED MRI SCAN
                  </div>

                  <h2>
                    {file.name}
                  </h2>

                </div>

                <button
                  className="remove-button"
                  onClick={handleRemove}
                >
                  Remove
                </button>

              </div>


              {/* IMAGE PREVIEW */}

              <div className="image-preview">

                <img
                  src={preview}
                  alt="Selected MRI scan"
                />

              </div>


              {/* FILE INFO */}

              <div className="file-info">

                <div>
                  <strong>File</strong>
                  <span>{file.name}</span>
                </div>

                <div>
                  <strong>Type</strong>
                  <span>{file.type || "Image"}</span>
                </div>

                <div>
                  <strong>Size</strong>
                  <span>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>

              </div>

            </div>

          )}


          {/* ================= ANALYZE ================= */}

          <div className="analyze-section">

            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={!file}
            >
              <span>✦</span>
              Analyze MRI
              <span>→</span>
            </button>

            <p>
              AI-assisted analysis • Fast • Secure
            </p>

          </div>

        </section>


        {/* ================= INFORMATION ================= */}

        <section className="upload-info">

          <div className="info-item">

            <div className="info-icon">
              🧠
            </div>

            <div>
              <h3>
                AI Analysis
              </h3>

              <p>
                Your MRI image is analyzed by our trained
                deep learning classification model.
              </p>
            </div>

          </div>


          <div className="info-item">

            <div className="info-icon">
              ⚡
            </div>

            <div>
              <h3>
                Fast Results
              </h3>

              <p>
                Receive the model prediction and class
                probabilities after analysis.
              </p>
            </div>

          </div>


          <div className="info-item">

            <div className="info-icon">
              🛡
            </div>

            <div>
              <h3>
                Secure
              </h3>

              <p>
                Your uploaded scan is used for the
                analysis request only.
              </p>
            </div>

          </div>

        </section>


        {/* ================= DISCLAIMER ================= */}

        <div className="upload-disclaimer">

          <strong>Important:</strong>

          <span>
            This AI system is intended for research and
            educational assistance and should not replace
            professional medical diagnosis.
          </span>

        </div>

      </main>

    </div>
  );
}

export default ScanUpload;