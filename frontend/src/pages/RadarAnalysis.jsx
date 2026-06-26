import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Radar,
} from "recharts";

const RadarAnalysis = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [chartData, setChartData] = useState([]);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [readinessLevel, setReadinessLevel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const role = localStorage.getItem("selectedRole") || "";

      const storedSkillGap =
        localStorage.getItem("skillGapAnalysis");

      if (!storedSkillGap) {
        setLoading(false);
        return;
      }

      const skillGapAnalysis =
        JSON.parse(storedSkillGap);

      setSelectedRole(role);

      const matched = Array.isArray(
        skillGapAnalysis.matchedSkills
      )
        ? skillGapAnalysis.matchedSkills
        : [];

      const missing = Array.isArray(
        skillGapAnalysis.missingSkills
      )
        ? skillGapAnalysis.missingSkills
        : [];

      const chart = [
        ...matched.map((skill) => ({
          skill,
          value: 100,
        })),

        ...missing.map((skill) => ({
          skill,
          value: 20,
        })),
      ];

      setMatchedSkills(matched);
      setMissingSkills(missing);
      setChartData(chart);

      setMatchPercentage(
        skillGapAnalysis.matchPercentage || 0
      );

      setReadinessLevel(
        skillGapAnalysis.readinessLevel || "Unknown"
      );
    } catch (error) {
      console.error(
        "Radar Analysis Error:",
        error
      );

      setChartData([]);
      setMatchedSkills([]);
      setMissingSkills([]);
      setMatchPercentage(0);
      setReadinessLevel("Unknown");
    } finally {
      setLoading(false);
    }
  }, []);

  
    if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF0E4] flex items-center justify-center">
        <h2 className="text-2xl font-bold text-[#007979]">
          Loading Analysis...
        </h2>
      </div>
    );
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-[#FFF0E4] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#007979]">
            No Resume Data Found
          </h2>

          <p className="mt-4 text-gray-600">
            Please upload a resume first.
          </p>

          <Link to="/dashboard">
            <button className="mt-6 bg-[#007979] hover:bg-[#24B1B1] text-white px-6 py-3 rounded-xl transition">
              Back To Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0E4] p-6 md:p-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#007979]">
          Skill Gap Analysis
        </h1>

        <p className="text-[#007979]/70 mt-2">
          Target Role: {selectedRole}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <p className="text-gray-500 text-sm">
            Skill Match
          </p>

          <h2 className="text-5xl font-bold text-[#007979] mt-3">
            {matchPercentage}%
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <p className="text-gray-500 text-sm">
            Matched Skills
          </p>

          <h2 className="text-5xl font-bold text-green-600 mt-3">
            {matchedSkills.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <p className="text-gray-500 text-sm">
            Missing Skills
          </p>

          <h2 className="text-5xl font-bold text-red-500 mt-3">
            {missingSkills.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <p className="text-gray-500 text-sm">
            Readiness
          </p>

          <h2 className="text-3xl font-bold text-[#007979] mt-3">
            {readinessLevel}
          </h2>
        </div>

      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10">

        <h2 className="text-2xl font-bold text-[#007979] mb-6">
          Skill Match Visualization
        </h2>

        {chartData.length > 0 ? (
          <div
            className="w-full"
            style={{ height: "450px" }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <RadarChart data={chartData}>
                <PolarGrid />

                <PolarAngleAxis dataKey="skill" />

                <PolarRadiusAxis
                  domain={[0, 100]}
                />

                <Radar
                  dataKey="value"
                  stroke="#007979"
                  fill="#24B1B1"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No skill data available
          </p>
        )}

      </div>

      {/* Skill Lists */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-3xl p-6 shadow-lg">

          <h3 className="text-xl font-bold text-green-600 mb-4">
            Matched Skills
          </h3>

          {matchedSkills.length > 0 ? (
            <ul className="space-y-2">
              {matchedSkills.map((skill, index) => (
                <li key={index}>
                  ✅ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p>No matched skills found.</p>
          )}

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">

          <h3 className="text-xl font-bold text-red-500 mb-4">
            Missing Skills
          </h3>

          {missingSkills.length > 0 ? (
            <ul className="space-y-2">
              {missingSkills.map((skill, index) => (
                <li key={index}>
                  ❌ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p>No missing skills.</p>
          )}

        </div>

      </div>

      {/* Back Button */}
      <div className="mt-10">
        <Link to="/dashboard">
          <button className="bg-[#007979] hover:bg-[#24B1B1] text-white px-6 py-3 rounded-xl transition">
            ← Back To Dashboard
          </button>
        </Link>
      </div>

    </div>
  );
};

export default RadarAnalysis;