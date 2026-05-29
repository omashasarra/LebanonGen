import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import sickleImage from "../images/sickle.webp";
import Footer from "../components/Footer";
import { FaDna, FaChartBar, FaShieldAlt } from "react-icons/fa";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay">
          <h1>Empowering Families Through Genetics</h1>
          <Link to="/login" className="cta-btn">
            Get Started
          </Link>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about" id="about">
        <div className="about-image">
          <img src={sickleImage} alt="Microscopic view of Sickle Cells" />
        </div>

        <div className="about-text">
          <h2>Understanding Sickle Cell Disease</h2>
          <p>
            Sickle Cell Disease (SCD) is a genetic condition affecting red blood
            cells.
            <strong> Normal cells are disc-shaped</strong> and move easily;
            <strong> sickle cells are rigid and crescent-shaped</strong>, often
            causing blockages and pain.
          </p>
          <div className="highlight-box">
            <p>
              By understanding your genetic makeup, you can make informed
              decisions for your family's long-term health.
            </p>
          </div>
          <Link to="/about" className="cta-btn secondary">
            Learn More About SCD →
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="stat">
          <h2>300M+</h2>
          <p>People carry the Sickle Cell gene worldwide</p>
        </div>
        <div className="stat">
          <h2>1 in 4</h2>
          <p>Chance of disease if both parents carry the gene</p>
        </div>
        <div className="stat">
          <h2>100%</h2>
          <p>Preventable with proper genetic screening</p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold text-red-700">Our Features</h2>
          <p className="text-gray-700 mt-2">
            Helping families understand and prevent SCD with modern tools.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Genetic Screening Card */}
          <div className="feature-card bg-red-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="icon-wrapper mb-4 text-red-600 flex justify-center">
              <FaDna size={50} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-700">
              Genetic Screening
            </h3>
            <p className="text-gray-700">
              Identify if you carry the sickle cell trait. Simple testing is the
              first step in proactive family health management.
            </p>
          </div>

          {/* Risk Assessment Card */}
          <div className="feature-card bg-red-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="icon-wrapper mb-4 text-red-600 flex justify-center">
              <FaChartBar size={50} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-700">
              Risk Assessment
            </h3>
            <p className="text-gray-700">
              Use our interactive dashboard to evaluate the probability of
              inheritance based on parental genetic data.
            </p>
          </div>

          {/* Prevention & Care Card */}
          <div className="feature-card bg-red-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="icon-wrapper mb-4 text-red-600 flex justify-center">
              <FaShieldAlt size={50} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-700">
              Prevention & Care
            </h3>
            <p className="text-gray-700">
              Access educational resources designed to support communities and
              reduce the impact of genetic disorders.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
