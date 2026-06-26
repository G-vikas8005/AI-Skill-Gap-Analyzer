import jobRoles from "../data/jobRoles.js";

/**
 * Normalize skill names
 */
const normalizeSkill = (skill) => {
  return String(skill)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
};

export const analyzeSkillGap = (resumeSkills = [], selectedRole = "") => {
  const roleData = jobRoles.find(
    (job) =>
      job.role.toLowerCase().trim() ===
      selectedRole.toLowerCase().trim()
  );

  if (!roleData) {
    return {
      matchedSkills: [],
      missingSkills: [],
      matchPercentage: 0,
      readinessLevel: "Unknown",
      chartData: [],
    };
  }

  // Normalize resume skills
  const normalizedResumeSkills = resumeSkills.map(normalizeSkill);

  const matchedSkills = [];
  const missingSkills = [];
  const chartData = [];

  roleData.skills.forEach((skill) => {
    const normalizedRoleSkill = normalizeSkill(skill);

    const found = normalizedResumeSkills.includes(normalizedRoleSkill);

    if (found) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }

    chartData.push({
      skill,
      value: found ? 100 : 20,
    });
  });

  const matchPercentage =
    roleData.skills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / roleData.skills.length) * 100
        );

  let readinessLevel = "Beginner";

  if (matchPercentage >= 80) {
    readinessLevel = "Job Ready";
  } else if (matchPercentage >= 60) {
    readinessLevel = "Intermediate";
  } else if (matchPercentage >= 40) {
    readinessLevel = "Learning";
  }

  return {
    matchedSkills,
    missingSkills,
    matchPercentage,
    readinessLevel,
    chartData,
  };
};