import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/History.css";

function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
     const response = await axios.get(
  "https://neuroscan-ai-4glb.onrender.com/history"
);

      if (response.data.success) {
        setScans(response.data.scans);
      } else {
        setError("Unable to load scan history.");
      }
    } catch (err) {
      console.error(err);
      setError("Backend server is not running.");
    } finally {
      setLoading(false);
    }
  };

  // Convert backend UTC time to Indian Standard Time (IST)
  const formatDateTime = (date) => {
    if (!date) return "—";

    const utcDate = new Date(
      date.replace(" ", "T") + "Z"
    );

    return utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="historyPage">
      <div className="historyHeader">
        <div>
          <p className="historyEyebrow">NEUROSCAN.AI</p>

          <h1>Scan History</h1>

          <p>
            View your previous brain MRI analysis results.
          </p>
        </div>

        <Link to="/upload" className="newScanBtn">
          + New Scan
        </Link>
      </div>

      <div className="historyCard">
        {loading && (
          <div className="historyMessage">
            Loading scan history...
          </div>
        )}

        {!loading && error && (
          <div className="historyMessage error">
            {error}
          </div>
        )}

        {!loading && !error && scans.length === 0 && (
          <div className="emptyHistory">
            <div className="emptyIcon">🧠</div>

            <h2>No scans yet</h2>

            <p>
              Upload an MRI scan to see your analysis history here.
            </p>

            <Link to="/upload" className="newScanBtn">
              Analyze MRI
            </Link>
          </div>
        )}

        {!loading && !error && scans.length > 0 && (
          <div className="tableWrapper">
            <table className="historyTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {scans.map((scan) => (
                  <tr key={scan.id}>
                    <td>#{scan.id}</td>

                    <td>
                      <span className="imageName">
                        {scan.image_name}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`predictionBadge ${scan.prediction}`}
                      >
                        {scan.prediction}
                      </span>
                    </td>

                    <td>
                      <strong>{scan.confidence}%</strong>
                    </td>

                    <td>
                      {formatDateTime(scan.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;