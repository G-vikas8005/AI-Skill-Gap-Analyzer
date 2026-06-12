import jobRoles from "../data/jobRoles.js";

export const analyzeSkillGap = (
  resumeSkills,
  selectedRole
) => {
  const roleData = jobRoles.find(
    (job) => job.role === selectedRole
  );

  if (!roleData) {
    return {
      matchedSkills: [],
      missingSkills: [],
      matchPercentage: 0,
      readinessLevel: "Unknown",
    };
  }

  const normalizedResumeSkills =
    resumeSkills.map((skill) =>
      skill.toLowerCase()
    );

  const matchedSkills = [];
  const missingSkills = [];

  roleData.skills.forEach((skill) => {
    if (
      normalizedResumeSkills.includes(
        skill.toLowerCase()
      )
    ) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchPercentage = Math.round(
    (matchedSkills.length /
      roleData.skills.length) *
      100
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
  };
};