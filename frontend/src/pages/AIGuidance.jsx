import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const AIGuidance = () => {
  const [resumeText, setResumeText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  
  // Changed state to hold the parsed structured data object instead of a raw string
  const [aiData, setAiData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Safe load core text from localStorage on mount
  useEffect(() => {
    try {
      const storedText = localStorage.getItem("resumeText");
      const storedRole = localStorage.getItem("selectedRole");
      const storedAnalysis = localStorage.getItem("aiAnalysis");

      if (storedText) setResumeText(storedText);
      if (storedRole) setSelectedRole(storedRole);
      
      // Auto-load previous dashboard analysis if it exists
      if (storedAnalysis) {
        setAiData(JSON.parse(storedAnalysis));
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
      setError("Failed to load saved data");
    }
  }, []);

  // Generate or Refresh AI Guidance from Backend
  const generateAI = async () => {
    try {
      setError("");
      setAiData(null);

      // VALIDATION
      if (!resumeText?.trim()) {
        setError("Please upload resume first");
        return;
      }

      if (!selectedRole?.trim()) {
        setError("Please select job role first");
        return;
      }

      if (loading) return; 
      setLoading(true);

      const response = await API.post("/ai/analyze", {
        resumeText,
        jobRole: selectedRole,
      });

      console.log("Raw Server Response Payload:", response.data);

      if (response.data?.success) {
        // Look for either response.data.aiAnalysis or response.data.aiResponse based on your controller setup
        const rawAiData = response.data.aiAnalysis || response.data.aiResponse;

        if (rawAiData) {
          let parsedData = rawAiData;
          
          // Fallback parsing engine in case the backend sent it back double-stringified
          if (typeof rawAiData === "string") {
            try {
              parsedData = JSON.parse(rawAiData);
            } catch {
              throw new Error("Received text string format instead of a structural profile layout object.");
            }
          }

          // Update state and persistent browser cache
          setAiData(parsedData);
          localStorage.setItem("aiAnalysis", JSON.stringify(parsedData));
        } else {
          setError("No structural feedback object returned from endpoint.");
        }
      } else {
        setError(response.data?.message || "AI generation failed");
      }

    } catch (error) {
      console.error("AI ERROR:", error);
      const status = error?.response?.status;

      if (status === 429) {
        setError("AI quota exceeded. Please try again later.");
      } else if (error?.response) {
        setError(error.response.data.message || "Server error");
      } else if (error.request) {
        setError("Backend not reachable");
      } else {
        setError(error.message || "Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0E4] p-6 md:p-10">

      {/* BACK NAVIGATION */}
      <div className="mb-6">
        <Link to="/dashboard" className="text-[#007979] hover:underline font-semibold">
          ← Back to Dashboard
        </Link>
      </div>

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#007979]">
          AI Career Guidance
        </h1>
        <p className="text-[#007979]/70 mt-2 text-lg">
          Target Role: <span className="font-bold">{selectedRole || "Not Selected"}</span>
        </p>
      </div>

      {/* ERROR BOX */}
      {error && (
        <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* ACTION CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-[#24B1B1]/20 mb-10">
        <h2 className="text-xl font-bold text-[#007979] mb-4">
          Get Personalized Career Advice
        </h2>
        <p className="text-gray-600 mb-6">
          AI will analyze your resume and generate a career roadmap,
          skill improvements, and interview preparation tips.
        </p>

        <button
          onClick={generateAI}
          disabled={loading}
          className={`px-6 py-3 rounded-xl transition w-full md:w-auto text-white font-semibold shadow-md
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#007979] hover:bg-[#24B1B1]"
            }`}
        >
          {loading ? "🔄 Analyzing Details..." : aiData ? "🔄 Refresh AI Response" : "Generate AI Guidance"}
        </button>
      </div>

      {/* SHIMMER LOADING PLACEHOLDER */}
      {loading && (
        <div className="space-y-6 max-w-5xl animate-pulse">
          <div className="bg-white rounded-3xl h-32 w-full border"></div>
          <div className="bg-white rounded-3xl h-48 w-full border"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl h-40 border"></div>
            <div className="bg-white rounded-3xl h-40 border"></div>
          </div>
        </div>
      )}

      {/* DYNAMIC METRIC & ROADMAP PANELS */}
      {aiData && !loading && (
        <div className="space-y-8 max-w-5xl">
          
          {/* ATS SCORE METRIC CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 text-center">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">ATS Match Score</h2>
            <div className="text-6xl font-black text-[#007979] mt-1">{aiData.atsScore}%</div>
            <span className="inline-block mt-2 px-4 py-1 rounded-full text-xs font-bold bg-[#24B1B1]/10 text-[#007979]">
              Match Quality: {aiData.matchQuality || "Calculated"}
            </span>
          </div>

          {/* SUMMARY DESCRIPTION */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-[#004A4A] mb-3">📋 Executive Summary</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiData.careerGuidance}</p>
          </div>

          {/* SYMMETRIC ATTRIBUTE PANELS */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-green-700 mb-3">✅ Key Strengths</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {aiData.strengths?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-amber-700 mb-3">⚠️ Areas of Improvement</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {aiData.weaknesses?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          {/* CHRONOLOGICAL ROADMAP STEPPER */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-[#004A4A] mb-6">🗺️ Actionable Upskilling Roadmap</h3>
            <div className="space-y-4">
              {aiData.roadmap?.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="bg-[#007979] text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INTERVIEW STRATEGY TIPS */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-[#004A4A] mb-3">💡 Interview Strategy & Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {aiData.interviewTips?.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};

export default AIGuidance;
