import React from "react";
import "../styles/about.css";
import family from "../images/family.png";
import Footer from "../components/Footer";
import team1 from "../images/ali.png";
import team2 from "../images/Leila.png";
import team3 from "../images/samer.png";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');
  .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .font-body    { font-family: 'Inter', sans-serif; }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.65); }
  }
  .animate-pulse-dot { animation: pulse-dot 2.2s infinite; }
  .hero-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .hero-radial {
    background: radial-gradient(ellipse 65% 55% at 50% 42%, rgba(220,38,38,0.5) 0%, transparent 72%);
  }
  .team-card-fancy .team-img img { transition: transform .55s ease; }
  .team-card-fancy:hover .team-img img { transform: scale(1.06); }
  .img-zoom img { transition: transform .55s ease; }
  .img-zoom:hover img { transform: scale(1.04); }
`;

function About() {
  return (
    <div className="font-body overflow-x-hidden">
      <style>{injectStyles}</style>

      {/* ── HERO ── */}
      <section className="relative bg-red-950 overflow-hidden flex items-center justify-center min-h-[60vh] text-center">
        <div className="absolute inset-0 hero-grid-bg" />
        <div className="absolute inset-0 hero-radial" />
        {/* Rings */}
        <div
          className="absolute rounded-full border border-white/[0.07] pointer-events-none"
          style={{
            width: 380,
            height: 380,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div
          className="absolute rounded-full border border-white/[0.04] pointer-events-none"
          style={{
            width: 660,
            height: 660,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        <div className="relative z-10 px-6 py-20 max-w-2xl">
          {/* Pill */}
          <div
            className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20
                          text-red-200 text-[10px] font-semibold tracking-[0.18em] uppercase
                          px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse-dot" />
            Our Mission
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl md:text-[4.5rem] font-bold text-white
                         leading-[1.08] tracking-tight mb-6"
          >
            Empowering Families
            <br />
            Through <em className="not-italic text-red-200">Genetic Clarity</em>
          </h1>

          <p className="text-white/55 text-base sm:text-lg font-light leading-relaxed max-w-lg mx-auto">
            Lebanon Gene is committed to reducing the impact of Sickle Cell
            Disease through innovative screening tools and community-driven
            education.
          </p>
        </div>
      </section>

      {/* ── BREADCRUMB ── */}
      <div
        className="bg-white border-b border-gray-100 px-6 sm:px-14 py-3 flex items-center gap-2
                      text-xs text-gray-400 font-medium tracking-wide"
      >
        Home <span className="text-gray-300">›</span>{" "}
        <span className="text-red-700">About Us</span>
      </div>

      {/* ── PURPOSE ── */}
      <section className="grid md:grid-cols-2 min-h-[560px] bg-white">
        {/* Image */}
        <div className="relative overflow-hidden min-h-[320px] img-zoom">
          <img
            src={family}
            alt="Genetic Research"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
          <div
            className="absolute bottom-6 left-6 bg-red-950/80 backdrop-blur-sm border border-white/10
                          text-white px-4 py-3 rounded-xl text-sm font-medium"
          >
            <span className="block text-[10px] text-white/50 uppercase tracking-widest mb-0.5">
              Lebanon Gene
            </span>
            Family-Centered Care
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center px-10 py-16 lg:px-20">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-700 mb-4">
            Our Purpose
          </span>
          <div className="w-10 h-0.5 bg-red-700 mb-6 rounded-full" />
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-red-950 leading-tight mb-6">
            A Vision for a<br />
            Healthier Lebanon
          </h2>
          <p className="text-gray-500 font-light leading-[1.9] text-base mb-5">
            Sickle Cell Disease (SCD) affects thousands of families across
            Lebanon. Our platform bridges the gap between complex genetic data
            and family planning.
          </p>
          <p className="text-gray-500 font-light leading-[1.9] text-base">
            By providing accessible, data-driven probability mapping, we empower
            parents to make the most informed decisions for their future
            children.
          </p>
        </div>
      </section>

      {/* ── VALUES STRIP ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#A61E22]">
        {" "}
        {[
          {
            icon: "🔬",
            title: "Science-First",
            desc: "Every prediction is grounded in peer-reviewed genetic research and clinical data.",
          },
          {
            icon: "🤝",
            title: "Community Care",
            desc: "Tools shaped by the families and communities most affected by SCD in Lebanon.",
          },
          {
            icon: "🛡️",
            title: "Privacy Always",
            desc: "Your genetic data stays yours. We never share or sell any personal information.",
          },
        ].map(({ icon, title, desc }, i) => (
          <div
            key={title}
            className={`text-center px-8 py-12 ${i < 2 ? "sm:border-r border-b sm:border-b-0 border-white/10" : ""}`}
          >
            <div className="text-3xl mb-4">{icon}</div>
            <div className="font-display text-xl font-bold text-white mb-2">
              {title}
            </div>
            <p className="text-white/55 text-sm font-light leading-relaxed max-w-[200px] mx-auto">
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── TEAM ── */}
      <section className="bg-stone-50 py-24 px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-700 mb-4 block">
            The People Behind It
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-red-950 leading-tight mb-3">
            Meet Our Team
          </h2>
          <p className="text-gray-500 font-light text-base max-w-md mx-auto">
            Dedicated researchers, clinicians, and administrators working to
            make genetic screening accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 max-w-4xl mx-auto">
          {[
            { img: team1, name: "Dr. Ali Nader", role: "Genetic Researcher" },
            { img: team2, name: "Dr. Leila Saab", role: "Medical Consultant" },
            { img: team3, name: "Samir Fares", role: "System Administrator" },
          ].map(({ img, name, role }) => (
            <div
              key={name}
              className="team-card-fancy bg-white border border-gray-100 rounded-2xl overflow-hidden
                            hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            >
              {/* Photo */}
              <div className="team-img relative h-56 overflow-hidden">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" />
              </div>
              {/* Info */}
              <div className="border-t-2 border-red-800 px-6 py-5 text-center">
                <div className="font-semibold text-gray-900 text-base mb-1">
                  {name}
                </div>
                <div className="text-red-700 text-xs font-semibold tracking-widest uppercase">
                  {role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
