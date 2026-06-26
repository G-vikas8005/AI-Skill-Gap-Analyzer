import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ATSAnalysis = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [layoutAnalysis, setLayoutAnalysis] = useState(null);

  useEffect(() => {
    try {
      const role = localStorage.getItem("selectedRole") || "";
      const rawLayout = localStorage.getItem("layoutAnalysis");
      const layout = rawLayout ? JSON.parse(rawLayout) : null;

      setSelectedRole(role);
      setLayoutAnalysis(layout && typeof layout === "object" ? layout : null);
    } catch (error) {
      console.error("ATS Analysis Error:", error);
      setLayoutAnalysis(null);
    }
  }, []);

  if (!layoutAnalysis) {
    return (
      <div className="min-h-screen bg-[#FFF0E4] flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#007979]">No Resume Data Found</h2>
          <p className="mt-3 text-gray-600">Please upload a resume first.</p>
          <Link to="/dashboard">
            <button className="mt-6 bg-[#007979] text-white px-6 py-3 rounded-xl hover:bg-[#24B1B1] transition-colors">
              Back To Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const atsScore = Math.min(Math.max(layoutAnalysis.atsScore ?? 0, 0), 100);

  return (
    <div className="min-h-screen bg-[#FFF0E4] p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#007979]">ATS Analysis Report</h1>
        <p className="text-[#007979]/70 mt-2">Role: {selectedRole}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-[#007979] mb-4">ATS Score</h2>

        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
          <div
            className="h-8 bg-[#007979] text-white flex items-center justify-center font-bold transition-all duration-500"
            style={{ width: `${atsScore}%` }}
          >
            {atsScore}%
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-[#007979] mb-4">Resume Statistics</h3>
          <div className="space-y-3">
            <p><strong>Pages:</strong> {layoutAnalysis.pages ?? "Unknown"}</p>
            <p><strong>Layout:</strong> {layoutAnalysis.columns === undefined ? "Unknown" : layoutAnalysis.columns === 2 ? "Multi Column" : "Single Column"}</p>
            <p><strong>Fonts:</strong> {Array.isArray(layoutAnalysis.fonts) && layoutAnalysis.fonts.length > 0 ? layoutAnalysis.fonts.join(", ") : "N/A"}</p>
            <p><strong>Margins:</strong> {layoutAnalysis.marginStatus ?? "Unknown"}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-[#007979] mb-4">ATS Risk Factors</h3>
          <div className="space-y-3">
            <p>{layoutAnalysis.columns === undefined ? "ℹ️ Layout information unavailable." : layoutAnalysis.columns === 2 ? "⚠️ Multiple columns detected." : "✅ ATS-friendly single-column layout."}</p>
            <p>{layoutAnalysis.hasTables ? "⚠️ Tables detected." : "✅ No tables detected."}</p>
            <p>{layoutAnalysis.hasImages ? "⚠️ Images detected." : "✅ No images detected."}</p>
            <p>{layoutAnalysis.hasIcons ? "⚠️ Icons detected." : "✅ No icons detected."}</p>
            <p>{layoutAnalysis.hasColors ? "⚠️ Multiple colors detected." : "✅ Simple ATS-friendly styling."}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-md mt-8">
        <h3 className="text-xl font-bold text-red-500 mb-4">ATS Issues</h3>
        {layoutAnalysis.issues?.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {layoutAnalysis.issues.map((issue, index) => (
              <li key={`${issue}-${index}`}>{issue}</li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600">No major ATS issues detected.</p>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-md mt-8">
        <h3 className="text-xl font-bold text-green-600 mb-4">Recommendations</h3>
        {layoutAnalysis.recommendations?.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {layoutAnalysis.recommendations.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600">Resume looks ATS friendly.</p>
        )}
      </div>

      <div className="mt-10">
        <Link to="/dashboard">
          <button className="bg-[#007979] hover:bg-[#24B1B1] text-white px-6 py-3 rounded-xl transition-colors">
            ← Back To Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ATSAnalysis;