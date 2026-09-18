import "../styles/HowItWorks.css";

function HowItWorks() {

  return (
    <section className="how-section" id="about">

      <div className="how-heading">

        <h2>
          How It Works?
        </h2>

        <p>
          Get your brain MRI analyzed in just a few simple steps.
        </p>

      </div>


      <div className="steps-container">


        {/* STEP 1 */}

        <div className="step">

          <div className="step-top">

            <div className="step-number">
              1
            </div>

          </div>

          <div className="step-body">

            <div className="step-icon">
              ⇩
            </div>

            <div className="step-content">

              <h3>
                Upload MRI Scan
              </h3>

              <p>
                Choose and upload your MRI image
                <br />
                (JPG, PNG, DICOM).
              </p>

            </div>

          </div>

        </div>


        {/* ARROW */}

        <div className="step-arrow">
          →
        </div>


        {/* STEP 2 */}

        <div className="step">

          <div className="step-top">

            <div className="step-number">
              2
            </div>

          </div>

          <div className="step-body">

            <div className="step-icon">
              ⚙
            </div>

            <div className="step-content">

              <h3>
                AI Analysis
              </h3>

              <p>
                Our model analyzes the scan
                <br />
                for any abnormalities.
              </p>

            </div>

          </div>

        </div>


        {/* ARROW */}

        <div className="step-arrow">
          →
        </div>


        {/* STEP 3 */}

        <div className="step">

          <div className="step-top">

            <div className="step-number">
              3
            </div>

          </div>

          <div className="step-body">

            <div className="step-icon">
              ▤
            </div>

            <div className="step-content">

              <h3>
                View Result
              </h3>

              <p>
                Get the prediction and class
                <br />
                probabilities instantly.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;