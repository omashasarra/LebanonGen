import { Link } from "react-router-dom";
import { GiDna2 } from "react-icons/gi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600&display=swap');

  .ft-root {
    font-family: 'Inter', sans-serif;
    background: #5C1016;
    position: relative;
    overflow: hidden;
  }

  /* Subtle grid background */
  .ft-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  /* Radial glow top-left */
  .ft-glow {
    position: absolute; pointer-events: none;
    width: 500px; height: 300px; top: -80px; left: -60px;
    background: radial-gradient(ellipse at 30% 40%, rgba(185,28,28,0.25) 0%, transparent 70%);
  }

  .ft-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    padding: 60px 32px 40px;
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr;
    gap: 48px;
  }

  @media (max-width: 860px) {
    .ft-inner {
      grid-template-columns: 1fr 1fr;
      gap: 36px;
    }
    .ft-brand { grid-column: span 2; }
  }
  @media (max-width: 540px) {
    .ft-inner { grid-template-columns: 1fr; }
    .ft-brand { grid-column: span 1; }
  }

  /* Brand column */
  .ft-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; margin-bottom: 16px;
  }
  .ft-logo-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, #7f1d1d, #991b1b);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(127,29,29,0.5);
  }
  .ft-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 700; color: #fff; line-height: 1.1;
  }
  .ft-brand-sub {
    font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 300;
    letter-spacing: 0.06em; margin-top: 2px;
  }
  .ft-tagline {
    font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 300;
    line-height: 1.75; max-width: 280px; margin-bottom: 20px;
  }

  /* Divider */
  .ft-col-divider {
    width: 32px; height: 2px;
    background: linear-gradient(90deg, #7f1d1d, transparent);
    border-radius: 99px; margin-bottom: 20px;
  }

  /* Social icons */
  .ft-socials { display: flex; gap: 10px; }
  .ft-social-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; font-size: 13px;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
  }
  .ft-social-btn:hover {
    background: #7f1d1d; border-color: #991b1b;
    color: #fff; transform: translateY(-2px);
  }

  /* Column headings */
  .ft-col-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 700; color: #fff;
    margin: 0 0 18px; letter-spacing: 0.01em;
  }

  /* Nav links */
  .ft-nav-link {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: rgba(255,255,255,0.45); font-weight: 300;
    text-decoration: none; padding: 5px 0;
    transition: color 0.2s, padding-left 0.2s;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ft-nav-link::before {
    content: ''; width: 4px; height: 4px; border-radius: 50%;
    background: #7f1d1d; flex-shrink: 0; opacity: 0;
    transition: opacity 0.2s;
  }
  .ft-nav-link:hover { color: #fecaca; padding-left: 4px; }
  .ft-nav-link:hover::before { opacity: 1; }

  /* Contact rows */
  .ft-contact-row {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13px; color: rgba(255,255,255,0.45); font-weight: 300;
    padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    line-height: 1.5;
    text-decoration: none;
    transition: color 0.2s;
  }
  .ft-contact-row:hover { color: #fecaca; }
  .ft-contact-icon {
    width: 26px; height: 26px; border-radius: 7px;
    background: rgba(127,29,29,0.35); border: 1px solid rgba(185,28,28,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 13px; color: #fca5a5;
  }

  /* Bottom bar */
  .ft-bottom {
    position: relative; z-index: 1;
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 18px 32px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
    max-width: 1100px; margin: 0 auto;
  }
  .ft-bottom-copy {
    font-size: 12px; color: rgba(255,255,255,0.2); font-weight: 300;
  }
  .ft-bottom-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(127,29,29,0.25); border: 1px solid rgba(185,28,28,0.3);
    border-radius: 999px; padding: 4px 10px;
    font-size: 10px; color: rgba(255,255,255,0.35); font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .ft-bottom-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #ef4444;
  }
  .ft-bottom-wrap {
    background: #451010;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
`;

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="ft-root">
        <div className="ft-grid" />
        <div className="ft-glow" />

        <div className="ft-inner">
          {/* ── Brand Column ── */}
          <div className="ft-brand">
            <Link to="/" className="ft-logo">
              <div className="ft-logo-icon">
                <GiDna2 style={{ color: "#fff", fontSize: 20 }} />
              </div>
              <div>
                <div className="ft-brand-name">
                  Lebanon<span style={{ color: "#fca5a5" }}>Gen</span>
                </div>
                <div className="ft-brand-sub">Sickle Cell Awareness</div>
              </div>
            </Link>

            <div className="ft-col-divider" />

            <p className="ft-tagline">
              LebanonGen is dedicated to raising awareness about sickle cell
              disease and providing AI-powered tools for couples across Lebanon
              to understand their genetic compatibility.
            </p>

            <div className="ft-socials">
              {[
                { icon: <FaFacebookF />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} className="ft-social-btn">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Navigation Column ── */}
          <div>
            <h4 className="ft-col-title">Navigation</h4>
            <div>
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/dashboard", label: "Health Dashboard" },
                { to: "/login", label: "Patient Login" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="ft-nav-link">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Contact Column ── */}
          <div>
            <h4 className="ft-col-title">Contact Us</h4>
            <div>
              <div className="ft-contact-row">
                <div className="ft-contact-icon">
                  <MdLocationOn />
                </div>
                <span>Beirut, Lebanon</span>
              </div>
              <a href="mailto:sickle@lebanongen.com" className="ft-contact-row">
                <div className="ft-contact-icon">
                  <MdEmail />
                </div>
                <span>sickle@lebanongen.com</span>
              </a>
              <a href="tel:+96171123456" className="ft-contact-row">
                <div className="ft-contact-icon">
                  <MdPhone />
                </div>
                <span>+961 71 123 456</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom-wrap">
          <div className="ft-bottom">
            <span className="ft-bottom-copy">
              &copy; {new Date().getFullYear()} LebanonGen — Sickle Cell
              Awareness &amp; Prevention
            </span>
            <span className="ft-bottom-badge">
              <span className="ft-bottom-dot" />
              AI-Powered Platform
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
