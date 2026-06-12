import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const AIGuidance = () => {
  const [resumeText, setResumeText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Safe load from localStorage
  useEffect(() => {
    try {
      const storedText = localStorage.getItem("resumeText");
      const storedRole = localStorage.getItem("selectedRole");

      if (storedText) setResumeText(storedText);
      if (storedRole) setSelectedRole(storedRole);
    } catch (err) {
      console.error("LocalStorage error:", err);
      setError("Failed to load saved data");
    }
  }, []);

  // Generate AI Guidance
  const generateAI = async () => {
    try {
      setError("");
      setAiResponse("");

      // VALIDATION
      if (!resumeText?.trim()) {
        setError("Please upload resume first");
        return;
      }

      if (!selectedRole?.trim()) {
        setError("Please select job role first");
        return;
      }

      if (loading) return; // PREVENT DOUBLE CLICK
      setLoading(true);

      const response = await API.post("/ai/analyze", {
        resumeText,
        jobRole: selectedRole,
      });

      console.log("Raw Server Response Payload:", response.data);

      if (response.data?.success) {
        const rawAiData = response.data.aiResponse;

        // SAFE INTERCEPTION: Ensure we extract pure string data before updating state
        if (typeof rawAiData === "object" && rawAiData !== null) {
          console.warn("⚠️ Received an object instead of a string string from the backend server!");
          
          // Try standard SDK properties sequentially
          const extractedText = rawAiData.text || rawAiData.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (extractedText) {
            setAiResponse(extractedText);
          } else {
            // Stringify it as a last resort so it safely prints as text without crashing React
            setAiResponse(JSON.stringify(rawAiData, null, 2));
          }
        } else {
          // If it is a clean text string, apply directly
          setAiResponse(rawAiData || "No feedback generated.");
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
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0E4] p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#007979]">
          AI Career Guidance
        </h1>
        <p className="text-[#007979]/70 mt-2">
          Role: {selectedRole || "Not Selected"}
        </p>
      </div>

      {/* ERROR BOX */}
      {error && (
        <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* ACTION CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-[#24B1B1]/20">
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
          className={`px-6 py-3 rounded-xl transition w-full md:w-auto text-white font-medium
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#007979] hover:bg-[#24B1B1]"
            }`}
        >
          {loading ? "Generating..." : "Generate AI Guidance"}
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="mt-10 bg-white rounded-3xl p-10 text-center shadow-md border">
          <div className="animate-pulse text-[#007979] text-lg font-medium">
            AI is analyzing your profile...
          </div>
        </div>
      )}

      {/* AI RESPONSE DISPLAY */}
      {aiResponse && (
        <div className="mt-10 bg-white rounded-3xl p-6 md:p-10 shadow-md border border-[#24B1B1]/20">
          <h3 className="text-2xl font-bold text-[#007979] mb-6">
            📌 Career Roadmap
          </h3>
          <div className="text-gray-700 leading-7 whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-xl">
            {/* SAFE GUARD: If something still slips through, typeof layout ensures zero-crash execution */}
            {typeof aiResponse === "string" ? aiResponse : JSON.stringify(aiResponse)}
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <div className="mt-10">
        <Link to="/dashboard">
          <button className="bg-[#007979] hover:bg-[#24B1B1] text-white px-6 py-3 rounded-xl transition">
            ← Back to Dashboard
          </button>
        </Link>
      </div>

    </div>
  );
};

export default AIGuidance;