import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import CoupleForm from "./components/CoupleForm";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Drlog from "./pages/Drlog";
import ChatBot from "./pages/ChatBot";
import MedicalConsultant from "./pages/MedicalConsultant";
import GeneticResearcher from "./pages/GeneticResearcher";
import SystemAdmin from "./pages/SystemAdmin";
import ScrollToTop from "./utils/ScrollOnTop";
import Reset from "./pages/Reset"
import "leaflet/dist/leaflet.css";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/form" element={<CoupleForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/drlog" element={<Drlog />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/reset" element={<Reset />} />

          {/* Role-Based Dashboard Routes */}
          <Route path="/dashboard/consultant" element={<MedicalConsultant />} />
          <Route path="/dashboard/researcher" element={<GeneticResearcher />} />
          <Route path="/dashboard/admin" element={<SystemAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
