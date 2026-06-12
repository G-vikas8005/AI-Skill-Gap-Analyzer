import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ATSAnalysis from "./pages/ATSAnalysis";
import RadarAnalysis from "./pages/RadarAnalysis";
import AIGuidance from "./pages/AIGuidance";

function App() {
  const location = useLocation();

  // Check if user is logged in
  const user = localStorage.getItem("user");

  // Hide navbar on auth pages when user is not logged in
  const hideNavbar =
    !user &&
    (location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register");

  return (
    <>
      {/* Navbar */}
      {!hideNavbar && <Navbar />}

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ats-analysis"
          element={
            <ProtectedRoute>
              <ATSAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/radar-analysis"
          element={
            <ProtectedRoute>
              <RadarAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-guidance"
          element={
            <ProtectedRoute>
              <AIGuidance />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;