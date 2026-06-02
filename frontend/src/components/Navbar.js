import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { GiDna2 } from "react-icons/gi";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("coupleID");
    localStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <GiDna2 className="text-red-600 text-4xl" />

          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-gray-800">
              Lebanon<span className="text-red-600">Gen</span>
            </span>

            <span className="text-sm text-gray-500">
              Genetic Disease Awareness
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li>
            <Link
              to="/"
              className="hover:text-red-600 transition duration-300"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="hover:text-red-600 transition duration-300"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard"
              className="hover:text-red-600 transition duration-300"
            >
              Dashboard
            </Link>
          </li>

          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hover:text-red-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hover:text-red-600 transition duration-300"
              >
                Login
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700"
          >
            {isOpen ? (
              <FaTimes className="text-2xl text-red-600" />
            ) : (
              <FaBars className="text-2xl text-red-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-white shadow-md py-4 px-6 space-y-4 text-gray-700 font-medium">
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>

          <li>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>

          <li>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}