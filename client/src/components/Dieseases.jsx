import "../styles/Diseases.css";

function Diseases() {

  const diseases = [
    {
      name: "Glioma",
      text: "A tumor that develops from glial cells within the brain."
    },

    {
      name: "Meningioma",
      text: "A tumor that develops from the membranes surrounding the brain."
    },

    {
      name: "Pituitary Tumor",
      text: "A tumor that develops around the pituitary gland."
    },

    {
      name: "No Tumor",
      text: "MRI scan showing no detectable brain tumor in the analyzed image."
    }
  ];

  return (

    <section className="diseases" id="diseases">

      <div className="sectionHeading">

        <p>DETECTION CATEGORIES</p>

        <h2>
          Brain MRI Classification
        </h2>

        <span>
          NeuroScan AI can assist in classifying MRI scans
          into different prediction categories.
        </span>

      </div>


      <div className="diseaseGrid">

        {diseases.map((disease, index) => (

          <div className="diseaseCard" key={index}>

            <div className="diseaseNumber">
              0{index + 1}
            </div>

            <h3>
              {disease.name}
            </h3>

            <p>
              {disease.text}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Diseases;