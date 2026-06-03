import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import sickleImage from "../images/sickle.webp";
import Footer from "../components/Footer";
import { FaDna, FaChartBar, FaShieldAlt } from "react-icons/fa";

function Home() {
  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero h-screen flex items-center justify-center text-center px-6">
        <div className="hero-overlay">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Empowering Families Through Genetics
          </h1>
          {/* Added bg-red-600 and padding for visibility */}
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about py-16 md:py-24 px-6 md:px-[10%] flex flex-col md:flex-row items-center gap-12 bg-white">
        <div className="about-image w-full md:w-1/2">
          <img
            src={sickleImage}
            alt="Microscopic view of Sickle Cells"
            className="rounded-2xl shadow-2xl w-full"
          />
        </div>

        <div className="about-text w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-6">
            Understanding Sickle Cell Disease
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            Sickle Cell Disease (SCD) is a genetic condition affecting red blood
            cells.
            <strong> Normal cells are disc-shaped</strong> and move easily;
            <strong> sickle cells are rigid and crescent-shaped</strong>, often
            causing blockages and pain.
          </p>
          <Link
            to="/about"
            className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            Learn More About SCD →
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 bg-red-900 text-white text-center">
        <div className="stat border-b md:border-b-0 md:border-r border-red-700 pb-8 md:pb-0">
          <h2 className="text-4xl font-bold">300M+</h2>
          <p className="mt-2 opacity-90">
            People carry the Sickle Cell gene worldwide
          </p>
        </div>
        <div className="stat border-b md:border-b-0 md:border-r border-red-700 pb-8 md:pb-0">
          <h2 className="text-4xl font-bold">1 in 4</h2>
          <p className="mt-2 opacity-90">
            Chance of disease if both parents carry the gene
          </p>
        </div>
        <div className="stat">
          <h2 className="text-4xl font-bold">100%</h2>
          <p className="mt-2 opacity-90">
            Preventable with proper genetic screening
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-700">
            Our Features
          </h2>
          <p className="text-gray-700 mt-2">
            Helping families understand and prevent SCD with modern tools.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              Icon: FaDna,
              title: "Genetic Screening",
              desc: "Identify if you carry the sickle cell trait. Simple testing is the first step.",
            },
            {
              Icon: FaChartBar,
              title: "Risk Assessment",
              desc: "Use our interactive dashboard to evaluate the probability of inheritance.",
            },
            {
              Icon: FaShieldAlt,
              title: "Prevention & Care",
              desc: "Access educational resources designed to support communities.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center border-t-4 border-red-700"
            >
              <div className="icon-wrapper mb-4 text-red-600 flex justify-center">
                <feature.Icon size={50} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-700">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
