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
      <section className="hero min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="hero-overlay max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Empowering Families Through Genetics
          </h1>
          <Link
            to="/login"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition duration-300 text-sm sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-[8%] lg:px-[10%] flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white">
        <div className="about-image w-full sm:w-4/5 md:w-1/2 mx-auto md:mx-0">
          <img
            src={sickleImage}
            alt="Microscopic view of Sickle Cells"
            className="rounded-2xl shadow-2xl w-full object-cover"
          />
        </div>

        <div className="about-text w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-800 mb-4 md:mb-6">
            Understanding Sickle Cell Disease
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-5 md:mb-6">
            Sickle Cell Disease (SCD) is a genetic condition affecting red blood
            cells.{" "}
            <strong>Normal cells are disc-shaped</strong> and move easily;{" "}
            <strong>sickle cells are rigid and crescent-shaped</strong>, often
            causing blockages and pain.
          </p>
          <Link
            to="/about"
            className="inline-block bg-red-800 hover:bg-red-900 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base"
          >
            Learn More About SCD →
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats py-10 sm:py-12 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-0 bg-red-900 text-white text-center">
        <div className="stat border-b sm:border-b-0 sm:border-r border-red-700 py-8 sm:py-0 sm:px-4">
          <h2 className="text-3xl sm:text-4xl font-bold">300M+</h2>
          <p className="mt-2 opacity-90 text-sm sm:text-base px-4">
            People carry the Sickle Cell gene worldwide
          </p>
        </div>
        <div className="stat border-b sm:border-b-0 sm:border-r border-red-700 py-8 sm:py-0 sm:px-4">
          <h2 className="text-3xl sm:text-4xl font-bold">1 in 4</h2>
          <p className="mt-2 opacity-90 text-sm sm:text-base px-4">
            Chance of disease if both parents carry the gene
          </p>
        </div>
        <div className="stat py-8 sm:py-0 sm:px-4">
          <h2 className="text-3xl sm:text-4xl font-bold">100%</h2>
          <p className="mt-2 opacity-90 text-sm sm:text-base px-4">
            Preventable with proper genetic screening
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features py-14 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-700">
            Our Features
          </h2>
          <p className="text-gray-700 mt-2 text-sm sm:text-base">
            Helping families understand and prevent SCD with modern tools.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
              className="feature-card bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center border-t-4 border-red-700"
            >
              <div className="icon-wrapper mb-4 text-red-600 flex justify-center">
                <feature.Icon size={44} className="sm:w-[50px] sm:h-[50px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-red-700">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
