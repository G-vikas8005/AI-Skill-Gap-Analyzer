import jobRoles from "../data/jobRoles.js";

/**
 * FAST NORMALIZER
 */
const normalizeSkill = (skill = "") =>
  String(skill)
    .toLowerCase()
    .replace(/[\s.\-_/]/g, "")
    .trim();

/**
 * SAFE MATCH ENGINE
 */
const isSkillMatch = (resumeSkill, roleSkill) => {
  const r = normalizeSkill(resumeSkill);
  const t = normalizeSkill(roleSkill);

  return r === t || r.includes(t) || t.includes(r);
};

/**
 * MAIN SKILL GAP ANALYZER (FIXED + DEBUG SAFE)
 */
export const analyzeSkillGap = (resumeSkills, selectedRole) => {
  try {
    console.log("🟡 Skill Gap Analyzer Started");
    console.log("Role:", selectedRole);

    const safeResumeSkills = Array.isArray(resumeSkills)
      ? resumeSkills
      : [];

    const roleData = jobRoles.find(
      (job) =>
        job.role?.toLowerCase().trim() ===
        (selectedRole || "").toLowerCase().trim()
    );

    if (!roleData) {
      console.warn("⚠️ Role not found:", selectedRole);

      return {
        matchedSkills: [],
        missingSkills: [],
        matchPercentage: 0,
        readinessLevel: "Unknown",
        confidenceScore: 0,
        chartData: [],
      };
    }

    /**
     * 🔥 FIX: use correct fields
     */
    const mustHave = Array.isArray(roleData.mustHave)
      ? roleData.mustHave
      : [];

    const goodToHave = Array.isArray(roleData.goodToHave)
      ? roleData.goodToHave
      : [];

    const allSkills = [...mustHave, ...goodToHave];

    const matchedSkills = [];
    const missingSkills = [];
    const chartData = [];

    /**
     * =========================
     * MUST HAVE (HIGH WEIGHT)
     * =========================
     */
    mustHave.forEach((skill, index) => {
      const found = safeResumeSkills.some((r) =>
        isSkillMatch(r, skill)
      );

      if (found) matchedSkills.push(skill);
      else missingSkills.push(skill);

      chartData.push({
        skill,
        value: found ? 1 : 0,
        importance: 10 - index, // higher weight
      });
    });

    /**
     * =========================
     * GOOD TO HAVE (LOW WEIGHT)
     * =========================
     */
    goodToHave.forEach((skill, index) => {
      const found = safeResumeSkills.some((r) =>
        isSkillMatch(r, skill)
      );

      if (found) matchedSkills.push(skill);

      chartData.push({
        skill,
        value: found ? 1 : 0,
        importance: 5 - index, // lower weight
      });
    });

    const totalSkills = allSkills.length;

    const matchPercentage =
      totalSkills === 0
        ? 0
        : Math.round((matchedSkills.length / totalSkills) * 100);

    const confidenceScore = Math.min(
      100,
      Math.round(
        (matchedSkills.length * 100) /
          (safeResumeSkills.length || 1)
      )
    );

    /**
     * READINESS MODEL (IMPROVED)
     */
    let readinessLevel = "Beginner";

    if (matchPercentage >= 85) {
      readinessLevel = "Job Ready";
    } else if (matchPercentage >= 65) {
      readinessLevel = "Intermediate";
    } else if (matchPercentage >= 40) {
      readinessLevel = "Learning";
    }

    return {
      matchedSkills,
      missingSkills,
      matchPercentage,
      readinessLevel,
      confidenceScore,
      chartData,
    };
  } catch (err) {
    console.error("❌ Skill Gap Analyzer Crash:", err);

    return {
      matchedSkills: [],
      missingSkills: [],
      matchPercentage: 0,
      readinessLevel: "Error",
      confidenceScore: 0,
      chartData: [],
    };
  }
};