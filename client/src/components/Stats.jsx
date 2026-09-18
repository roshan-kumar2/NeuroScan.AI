import "../styles/Stats.css";

function Stats() {

  const stats = [
    {
      number: "98%",
      label: "Detection Accuracy"
    },
    {
      number: "4+",
      label: "Tumor Types"
    },
    {
      number: "10K+",
      label: "MRI Scans"
    },
    {
      number: "24/7",
      label: "System Support"
    }
  ];

  return (
    <section className="statsSection">

      <div className="statsContainer">

        {stats.map((stat, index) => (

          <div className="statBox" key={index}>

            <h2>{stat.number}</h2>

            <p>{stat.label}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Stats;