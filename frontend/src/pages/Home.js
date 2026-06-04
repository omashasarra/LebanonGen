import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import sickleImage from "../images/sickle.webp";
import Footer from "../components/Footer";
import { FaDna, FaChartBar, FaShieldAlt } from "react-icons/fa";

/* Tiny global styles only for things Tailwind can't do:
   custom font, keyframes, the ::after pseudo-element trick */
const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');
  .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .font-body    { font-family: 'Inter', sans-serif; }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.65); }
  }
  @keyframes line-drop {
    0%   { transform:scaleY(0); transform-origin:top; opacity:1; }
    100% { transform:scaleY(1); transform-origin:top; opacity:0; }
  }
  .animate-pulse-dot  { animation: pulse-dot 2.2s infinite; }
  .animate-line-drop  { animation: line-drop 2s infinite; }
  .hero-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .hero-radial {
    background: radial-gradient(ellipse 65% 55% at 50% 42%, rgba(220,38,38,0.5) 0%, transparent 72%);
  }
  .feature-card-fancy::after {
    content:''; position:absolute; inset-x:0; top:0;
    height:2px; background:#b91c1c;
    transform:scaleX(0); transform-origin:left;
    transition:transform .35s ease;
  }
  .feature-card-fancy:hover::after { transform:scaleX(1); }
  .img-zoom img { transition: transform .55s ease; }
  .img-zoom:hover img { transform: scale(1.04); }
`;

function Home() {
  return (
    <div className="font-body overflow-x-hidden">
      <style>{injectStyles}</style>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-red-950 overflow-hidden">
        {/* Grid + radial overlays */}
        <div className="absolute inset-0 hero-grid-bg" />
        <div className="absolute inset-0 hero-radial" />

        {/* Decorative rings */}
        <div className="absolute rounded-full border border-white/[0.07] pointer-events-none"
          style={{ width: 440, height: 440, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        <div className="absolute rounded-full border border-white/[0.04] pointer-events-none"
          style={{ width: 740, height: 740, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl w-full">
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 text-red-200
                          text-[10px] font-semibold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse-dot" />
            Genetic Risk Intelligence
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            Empowering Families<br />
            Through{" "}
            <em className="not-italic text-red-200">Genetics</em>
          </h1>

          {/* Subtitle */}
          <p className="text-white/55 text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto mb-10">
            AI-powered sickle cell disease prediction to help families make
            informed decisions — one genetic profile at a time.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-red-950 font-semibold
                         px-8 py-3.5 rounded-lg text-sm tracking-wide
                         hover:bg-red-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started <span className="text-base">→</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-white/70 border border-white/20
                         px-7 py-3.5 rounded-lg text-sm font-medium
                         hover:border-white/40 hover:text-white transition-all duration-200"
            >
              Learn About SCD
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                        text-white/30 text-[10px] tracking-[0.14em] uppercase z-10">
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-line-drop" />
          scroll
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
        {["ML-powered prediction", "Built for clinical use", "Evidence-based screening", "Family-centered care"].map((item) => (
          <div key={item} className="flex items-center gap-2.5 text-xs text-gray-500 font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            {item}
          </div>
        ))}
      </div>

      {/* ── ABOUT / SCD ── */}
      <section className="grid md:grid-cols-2 mb-24 min-h-[580px] bg-white">
        {/* Image panel */}
        <div className="relative overflow-hidden min-h-[340px] img-zoom">
          <img src={sickleImage} alt="Microscopic view of Sickle Cells"
               className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-transparent" />
          {/* Floating badge */}
          <div className="absolute bottom-6 left-6 bg-red-950/80 backdrop-blur-sm border border-white/10
                          text-white px-4 py-3 rounded-xl text-sm font-medium">
            <span className="block text-[10px] text-white/50 uppercase tracking-widest mb-0.5">Microscopy</span>
            Sickle Cell vs Normal RBC
          </div>
        </div>

        {/* Text panel */}
        <div className="flex flex-col justify-center px-10 py-16 lg:px-20">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-700 mb-4">
            About the Disease
          </span>
          <div className="w-10 h-0.5 bg-red-700 mb-6 rounded-full" />
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-red-950 leading-tight mb-6">
            Understanding<br />Sickle Cell Disease
          </h2>
          <p className="text-gray-500 font-light leading-[1.9] text-base mb-8">
            Sickle Cell Disease (SCD) is a genetic condition affecting red blood cells.{" "}
            <strong className="text-gray-800 font-semibold">Normal cells are disc-shaped</strong> and move
            freely through vessels;{" "}
            <strong className="text-gray-800 font-semibold">sickle cells are rigid and crescent-shaped</strong>,
            causing painful blockages and organ damage.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-3 bg-red-900 text-white font-medium
                       px-7 py-3.5 rounded-lg text-sm w-fit
                       hover:bg-red-800 hover:gap-4 transition-all duration-200"
          >
            Learn More About SCD <span className="text-base">→</span>
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 bg-[#5C1016]">
        {[
          { num: "300M", accent: "+", desc: "People carry the Sickle Cell gene worldwide" },
          { num: "1 in 4", accent: "",  desc: "Chance of disease if both parents carry the gene" },
          { num: "100",   accent: "%", desc: "Preventable with proper genetic screening" },
        ].map(({ num, accent, desc }, i) => (
          <div key={num}
               className={`text-center px-8 py-14 ${i < 2 ? "sm:border-r border-b sm:border-b-0 border-white/10" : ""}`}>
            <div className="font-display text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
              {num}<span className="text-red-200">{accent}</span>
            </div>
            <p className="text-white/55 text-sm font-light leading-relaxed max-w-[180px] mx-auto mb-5">{desc}</p>
            <div className="w-8 h-px bg-white/25 mx-auto rounded-full" />
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-stone-50 py-24 px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-700 mb-4 block">
            What We Offer
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-red-950 leading-tight mb-4">
            Our Features
          </h2>
          <p className="text-gray-500 font-light leading-relaxed">
            Helping families understand and prevent SCD with modern, intelligent tools.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              Icon: FaDna,
              title: "Genetic Screening",
              desc: "Identify if you carry the sickle cell trait. Simple, accurate testing is the essential first step toward informed family planning.",
            },
            {
              Icon: FaChartBar,
              title: "Risk Assessment",
              desc: "Use our ML dashboard to evaluate the probability of inheritance based on each parent's unique genetic profile.",
            },
            {
              Icon: FaShieldAlt,
              title: "Prevention & Care",
              desc: "Access evidence-based educational resources designed to support patients, families, and healthcare providers.",
            },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i}
                 className="feature-card-fancy relative bg-white border border-gray-100 rounded-2xl p-8
                            hover:-translate-y-1 hover:shadow-xl hover:border-transparent
                            transition-all duration-300 overflow-hidden flex flex-col gap-5">
              {/* Icon */}
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-800">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;