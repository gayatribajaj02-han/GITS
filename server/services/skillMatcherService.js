/**
 * Skill Normalizer and Skill Matching Engine
 */

// Common skill alias mappings
const SKILL_ALIASES = {
  'react.js': 'react',
  'reactjs': 'react',
  'node.js': 'node',
  'nodejs': 'node',
  'express.js': 'express',
  'expressjs': 'express',
  'vue.js': 'vue',
  'vuejs': 'vue',
  'angular.js': 'angular',
  'angularjs': 'angular',
  'next.js': 'nextjs',
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'cpp': 'c++',
  'postgres': 'postgresql',
  'mongo': 'mongodb',
  'aws cloud': 'aws',
  'amazon web services': 'aws',
  'docker container': 'docker',
};

/**
 * Normalizes a skill string for accurate comparisons
 * @param {string} skill 
 * @returns {string}
 */
const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return '';
  
  let cleaned = skill.trim().toLowerCase();
  
  // Check alias map
  if (SKILL_ALIASES[cleaned]) {
    return SKILL_ALIASES[cleaned];
  }
  
  return cleaned;
};

/**
 * Calculates skill compatibility match score between a student and job requirements
 * @param {Array<string>} studentSkills 
 * @param {Array<string>} requiredSkills 
 * @returns {Object} { matchScore, matchedSkills, missingSkills }
 */
const matchSkills = (studentSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchScore: 100,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  // Normalize student skill set for fast lookup
  const studentSkillSet = new Set(
    (studentSkills || []).map(s => normalizeSkill(s)).filter(Boolean)
  );

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(reqSkill => {
    const normalizedReq = normalizeSkill(reqSkill);
    
    // Check if student has the skill directly or in normalized form
    const isMatched = Array.from(studentSkillSet).some(stSkill => {
      return stSkill === normalizedReq || stSkill.includes(normalizedReq) || normalizedReq.includes(stSkill);
    });

    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const matchedCount = matchedSkills.length;
  const totalRequired = requiredSkills.length;
  const matchScore = Math.round((matchedCount / totalRequired) * 100);

  return {
    matchScore,
    matchedSkills,
    missingSkills,
  };
};

module.exports = {
  normalizeSkill,
  matchSkills,
};
