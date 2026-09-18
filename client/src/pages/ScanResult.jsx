import { useLocation, useNavigate } from "react-router-dom";

function ScanResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    prediction,
    confidence,
    probabilities,
    image,
  } = location.state || {};

  const formatPrediction = (value) => {
    if (!value) return "No Result";

    const names = {
      glioma: "Glioma",
      meningioma: "Meningioma",
      notumor: "No Tumor Detected",
      pituitary: "Pituitary Tumor",
    };

    return names[value.toLowerCase()] || value;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f9fc",
        padding: "120px 8%",
        color: "#172033",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "50px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Header */}
        <p
          style={{
            color: "#2563eb",
            letterSpacing: "2px",
            fontWeight: "600",
          }}
        >
          NEUROSCAN.AI
        </p>

        <h1 style={{ marginTop: "15px" }}>
          MRI Analysis Result
        </h1>

        {/* Uploaded MRI */}
        {image && (
          <div style={{ marginTop: "30px" }}>
            <p style={{ color: "#64748b" }}>
              Uploaded MRI Scan
            </p>

            <img
              src={image}
              alt="Uploaded MRI"
              style={{
                width: "250px",
                height: "250px",
                objectFit: "contain",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                marginTop: "10px",
              }}
            />
          </div>
        )}

        {/* Status */}
        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ color: "#16a34a" }}>
            Analysis Completed
          </h2>

          <p
            style={{
              marginTop: "15px",
              color: "#64748b",
            }}
          >
            The uploaded MRI scan has been processed by
            the NeuroScan AI system.
          </p>
        </div>

        {/* Prediction + Confidence */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          {/* Prediction */}
          <div
            style={{
              padding: "25px",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
            }}
          >
            <p style={{ color: "#64748b" }}>
              Prediction
            </p>

            <h2 style={{ marginTop: "10px" }}>
              {formatPrediction(prediction)}
            </h2>
          </div>

          {/* Confidence */}
          <div
            style={{
              padding: "25px",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
            }}
          >
            <p style={{ color: "#64748b" }}>
              Confidence
            </p>

            <h2
              style={{
                marginTop: "10px",
                color: "#2563eb",
              }}
            >
              {confidence !== undefined
                ? `${confidence}%`
                : "--"}
            </h2>
          </div>
        </div>

        {/* Class Probabilities */}
        {probabilities && (
          <div
            style={{
              marginTop: "25px",
              padding: "25px",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
            }}
          >
            <h3>Class Probabilities</h3>

            {Object.entries(probabilities).map(
              ([className, probability]) => (
                <div
                  key={className}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    {formatPrediction(className)}
                  </span>

                  <strong>
                    {probability}%
                  </strong>
                </div>
              )
            )}
          </div>
        )}

        {/* Disclaimer */}
        <p
          style={{
            marginTop: "30px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Note: This system is intended for AI-assisted
          analysis and does not replace professional
          medical diagnosis.
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate("/upload")}
          style={{
            marginTop: "25px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Analyze Another MRI
        </button>
      </div>
    </div>
  );
}

export default ScanResult;