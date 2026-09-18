import "../styles/Features.css";

function Features() {

  const features = [
    {
      icon: "🧠",
      title: "AI Detection",
      text: "Advanced deep learning models analyze MRI scans for accurate detection."
    },
    {
      icon: "ϟ",
      title: "Fast Analysis",
      text: "Get results within seconds using our trained AI model."
    },
    {
      icon: "🛡",
      title: "Secure Reports",
      text: "Your data is encrypted and kept private with industry standard security."
    },
    {
      icon: "👤",
      title: "Doctor Support",
      text: "Designed to assist medical professionals in better and faster diagnosis."
    }
  ];

  return (
    <section className="features-section">

      <div className="features-container">

        {features.map((feature, index) => (

          <div className="feature-item" key={index}>

            <div className="feature-icon">
              {feature.icon}
            </div>

            <div className="feature-content">

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;