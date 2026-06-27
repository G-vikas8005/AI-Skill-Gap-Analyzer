import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import jobRoles from "../data/jobRoles";
import Background3D from "../components/Background3D";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : { name: "User" };
    } catch {
      return { name: "User" };
    }
  });

  const [resume, setResume] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("selectedRole") || "");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
  if (!resume || !role) {
    alert("Upload resume + select role");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("selectedRole", role);

  try {
    setLoading(true);

    const res = await API.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const {
      structuredResume,
      layoutAnalysis,
      skillGapAnalysis,
      extractedText,
      aiAnalysis, // Extract this from backend response
    } = res.data;

    localStorage.setItem("selectedRole", role);
    localStorage.setItem("structuredResume", JSON.stringify(structuredResume));
    localStorage.setItem("layoutAnalysis", JSON.stringify(layoutAnalysis));
    localStorage.setItem("skillGapAnalysis", JSON.stringify(skillGapAnalysis));
    localStorage.setItem("resumeText", extractedText || "");
    
    // ✅ FIXED: Save the actual parsed AI JSON object
    localStorage.setItem("aiAnalysis", JSON.stringify(aiAnalysis));

    alert("Analysis complete 🚀");
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen bg-[#FFF0E4] overflow-hidden">

      {/* 🌌 3D BACKGROUND */}
      <Background3D />

      {/* CONTENT */}
      <div className="relative z-10 px-4 md:px-10 py-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#004A4A]">
            Welcome back,{" "}
            <span className="text-[#007979]">{user.name}</span>
          </h1>
          <p className="text-[#006666] mt-2 text-sm md:text-lg">
            AI-powered career intelligence dashboard
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

          {/* LEFT MAIN PANEL */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-xl border border-[#24B1B1]/20">

            <h2 className="text-2xl md:text-3xl font-bold text-[#007979] mb-4">
              🚀 Resume AI Analyzer
            </h2>

            <p className="text-gray-600 mb-6">
              Upload resume and get AI-powered skill insights
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full mb-4 p-4 border rounded-xl bg-white"
            />

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                localStorage.setItem("selectedRole", e.target.value);
              }}
              className="w-full p-4 border rounded-xl mb-6"
            >
              <option value="">Select Target Role</option>
              {jobRoles.map((j, i) => (
                <option key={i} value={j.role}>
                  {j.role}
                </option>
              ))}
            </select>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full py-4 rounded-xl text-white text-lg font-semibold bg-[#007979] hover:bg-[#006666] transition"
            >
              {loading ? "Analyzing..." : "Run AI Analysis"}
            </button>
          </div>

          {/* RIGHT BIG CARDS */}
          <div className="space-y-6">

            {[
              {
                title: "🎯 ATS Analysis",
                desc: "Resume compatibility score",
                path: "/ats-analysis",
              },
              {
                title: "📊 Skill Gap",
                desc: "Missing skills breakdown",
                path: "/radar-analysis",
              },
              {
                title: "🤖 AI Roadmap",
                desc: "Personalized career plan",
                path: "/ai-guidance",
              },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="cursor-pointer bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-100 hover:scale-[1.03] transition duration-300"
              >
                <h3 className="text-xl font-bold text-[#007979]">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;