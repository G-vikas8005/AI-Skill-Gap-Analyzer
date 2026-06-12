import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import jobRoles from "../data/jobRoles";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : { name: "User" };
    } catch (error) {
      console.error("Error parsing user:", error);
      return { name: "User" };
    }
  });

  const [resume, setResume] = useState(null);
  const [selectedRole, setSelectedRole] = useState(
    localStorage.getItem("selectedRole") || ""
  );
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      e.target.value = ""; // Clears the invalid file out of the HTML input element
      setResume(null);
      return;
    }
    setResume(file);
  };

  const handleUpload = async () => {
    if (!resume) {
      alert("Please select a resume PDF");
      return;
    }

    if (!selectedRole) {
      alert("Please select a target job role");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("selectedRole", selectedRole);

    try {
      setLoading(true);

      const response = await API.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      localStorage.setItem("resumeText", data.extractedText || "");
      localStorage.setItem("structuredResume", JSON.stringify(data.structuredResume || {}));
      localStorage.setItem("layoutAnalysis", JSON.stringify(data.layoutAnalysis || {}));
      localStorage.setItem("skillGapAnalysis", JSON.stringify(data.skillGapAnalysis || {}));
      localStorage.setItem("selectedRole", selectedRole);

      alert("Resume uploaded successfully");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0E4] p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-[#007979]">
          Welcome back, {user.name}
        </h1>
        <p className="text-[#007979]/70 mt-2">
          AI Skill Gap Analyzer Dashboard
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-lg border border-[#24B1B1]/20">
        <h2 className="text-xl font-bold text-[#007979] mb-4">
          Upload Resume
        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full mb-4 p-3 border rounded-xl"
        />

        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            localStorage.setItem("selectedRole", e.target.value); // Immediate persistence sync
          }}
          className="w-full p-3 border rounded-xl mb-4"
        >
          <option value="">Select Job Role</option>
          {jobRoles.map((job, index) => (
            <option key={index} value={job.role}>
              {job.role}
            </option>
          ))}
        </select>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-[#007979] hover:bg-[#24B1B1] text-white py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing Resume..." : "Upload Resume"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div
          onClick={() => {
            if (!localStorage.getItem("layoutAnalysis")) {
              alert("Upload resume first");
              return;
            }
            navigate("/ats-analysis");
          }}
          className="cursor-pointer bg-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition"
        >
          <h3 className="text-xl font-bold text-[#007979]">🎯 ATS Analysis</h3>
          <p className="text-gray-600 mt-2">
            Real ATS scoring and formatting checks
          </p>
        </div>

        <div
          onClick={() => {
            if (!localStorage.getItem("skillGapAnalysis")) {
              alert("Upload resume first");
              return;
            }
            navigate("/radar-analysis");
          }}
          className="cursor-pointer bg-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition"
        >
          <h3 className="text-xl font-bold text-[#007979]">📊 Skill Gap Analysis</h3>
          <p className="text-gray-600 mt-2">
            Compare skills against target role
          </p>
        </div>

        <div
          onClick={() => {
            if (!localStorage.getItem("skillGapAnalysis")) {
              alert("Upload resume first");
              return;
            }
            navigate("/ai-guidance");
          }}
          className="cursor-pointer bg-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition"
        >
          <h3 className="text-xl font-bold text-[#007979]">🤖 AI Guidance</h3>
          <p className="text-gray-600 mt-2">
            Personalized roadmap and suggestions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;