import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:5000/history"
      );

      if (response.data?.success) {
        setScans(response.data.scans || []);
      } else {
        setError("Unable to load scan history.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        "Unable to connect to the NeuroScan.AI backend."
      );
    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     STATISTICS
     ========================================================= */

  const totalScans = scans.length;

  const tumorScans = scans.filter(
    (scan) =>
      scan.prediction &&
      scan.prediction.toLowerCase() !== "notumor"
  ).length;

  const noTumorScans = scans.filter(
    (scan) =>
      scan.prediction &&
      scan.prediction.toLowerCase() === "notumor"
  ).length;

  const averageConfidence =
    totalScans > 0
      ? scans.reduce(
          (sum, scan) =>
            sum + Number(scan.confidence || 0),
          0
        ) / totalScans
      : 0;


  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(
      dateValue.replace(" ", "T") + "Z"
    );

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  /* =========================================================
     PREDICTION LABEL
     ========================================================= */

  const formatPrediction = (prediction) => {
    if (!prediction) {
      return "Unknown";
    }

    if (prediction.toLowerCase() === "notumor") {
      return "No Tumor";
    }

    return (
      prediction.charAt(0).toUpperCase() +
      prediction.slice(1)
    );
  };


  /* =========================================================
     PREDICTION CLASS
     ========================================================= */

  const getPredictionClass = (prediction) => {
    if (
      prediction &&
      prediction.toLowerCase() === "notumor"
    ) {
      return "prediction-normal";
    }

    return "prediction-tumor";
  };


  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="dashboard-header">

        <div>
          <div className="dashboard-eyebrow">
            NEUROSCAN.AI
          </div>

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your brain MRI analysis activity.
          </p>
        </div>


        <button
          className="dashboard-new-scan"
          onClick={() => navigate("/upload")}
        >
          + New Scan
        </button>

      </div>


      {/* =====================================================
          STAT CARDS
          ===================================================== */}

      <div className="dashboard-stats">

        {/* TOTAL */}

        <div className="dashboard-stat-card">

          <div className="stat-icon blue">
            🧠
          </div>

          <div>
            <span>
              Total Scans
            </span>

            <strong>
              {loading ? "—" : totalScans}
            </strong>

            <small>
              MRI analyses performed
            </small>
          </div>

        </div>


        {/* TUMOR */}

        <div className="dashboard-stat-card">

          <div className="stat-icon orange">
            ⚠
          </div>

          <div>
            <span>
              Tumor Detected
            </span>

            <strong>
              {loading ? "—" : tumorScans}
            </strong>

            <small>
              Classified as tumor
            </small>
          </div>

        </div>


        {/* NO TUMOR */}

        <div className="dashboard-stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>
            <span>
              No Tumor
            </span>

            <strong>
              {loading ? "—" : noTumorScans}
            </strong>

            <small>
              Classified as no tumor
            </small>
          </div>

        </div>


        {/* CONFIDENCE */}

        <div className="dashboard-stat-card">

          <div className="stat-icon purple">
            %
          </div>

          <div>
            <span>
              Avg. Confidence
            </span>

            <strong>
              {loading
                ? "—"
                : `${averageConfidence.toFixed(2)}%`}
            </strong>

            <small>
              Across all analyses
            </small>
          </div>

        </div>

      </div>


      {/* =====================================================
          RECENT SCANS
          ===================================================== */}

      <div className="dashboard-content">

        <div className="dashboard-table-card">

          <div className="table-header">

            <div>
              <h2>
                Recent Scans
              </h2>

              <p>
                Latest MRI classification results
              </p>
            </div>

            <button
              className="view-history-btn"
              onClick={() => navigate("/history")}
            >
              View Full History →
            </button>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="dashboard-message">
              <div className="loading-spinner"></div>

              <p>
                Loading scan history...
              </p>
            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="dashboard-message error-message">

              <div className="message-icon">
                !
              </div>

              <p>
                {error}
              </p>

              <button
                onClick={fetchDashboardData}
              >
                Try Again
              </button>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            scans.length === 0 && (

              <div className="dashboard-message">

                <div className="empty-icon">
                  🧠
                </div>

                <h3>
                  No scans yet
                </h3>

                <p>
                  Upload your first MRI scan to see
                  analysis results here.
                </p>

                <button
                  onClick={() => navigate("/upload")}
                >
                  Start New Scan
                </button>

              </div>

          )}


          {/* TABLE */}

          {!loading &&
            !error &&
            scans.length > 0 && (

              <div className="dashboard-table-wrapper">

                <table className="dashboard-table">

                  <thead>
                    <tr>
                      <th>
                        ID
                      </th>

                      <th>
                        MRI Image
                      </th>

                      <th>
                        Prediction
                      </th>

                      <th>
                        Confidence
                      </th>

                      <th>
                        Date & Time
                      </th>
                    </tr>
                  </thead>


                  <tbody>

                    {scans
                      .slice(0, 6)
                      .map((scan) => (

                        <tr key={scan.id}>

                          <td>
                            #{scan.id}
                          </td>

                          <td>
                            <span className="image-name">
                              {scan.image_name}
                            </span>
                          </td>

                          <td>

                            <span
                              className={`prediction-badge ${getPredictionClass(
                                scan.prediction
                              )}`}
                            >
                              {formatPrediction(
                                scan.prediction
                              )}
                            </span>

                          </td>

                          <td>

                            <strong className="confidence-value">
                              {Number(
                                scan.confidence || 0
                              ).toFixed(2)}
                              %
                            </strong>

                          </td>

                          <td className="date-value">
                            {formatDate(
                              scan.created_at
                            )}
                          </td>

                        </tr>

                    ))}

                  </tbody>

                </table>

              </div>

          )}

        </div>


        {/* ===================================================
            QUICK ACTIONS
            =================================================== */}

        <div className="quick-actions-card">

          <h2>
            Quick Actions
          </h2>

          <p>
            Access common NeuroScan.AI functions.
          </p>


          <button
            onClick={() => navigate("/upload")}
            className="quick-action primary-action"
          >
            <span className="quick-icon">
              ↑
            </span>

            <span>
              <strong>
                Analyze MRI
              </strong>

              <small>
                Upload a new brain MRI scan
              </small>
            </span>

            <b>
              →
            </b>
          </button>


          <button
            onClick={() => navigate("/history")}
            className="quick-action"
          >
            <span className="quick-icon">
              ◷
            </span>

            <span>
              <strong>
                Scan History
              </strong>

              <small>
                View all previous analyses
              </small>
            </span>

            <b>
              →
            </b>
          </button>


          <button
            onClick={() => navigate("/")}
            className="quick-action"
          >
            <span className="quick-icon">
              ⌂
            </span>

            <span>
              <strong>
                Home
              </strong>

              <small>
                Return to NeuroScan.AI home
              </small>
            </span>

            <b>
              →
            </b>
          </button>

        </div>

      </div>


      {/* =====================================================
          MEDICAL NOTICE
          ===================================================== */}

      <div className="dashboard-notice">

        <strong>
          Medical Notice:
        </strong>

        NeuroScan.AI provides AI-assisted image
        classification for research and educational
        assistance. Results should not be considered
        a medical diagnosis.

      </div>

    </div>
  );
}

export default Dashboard;