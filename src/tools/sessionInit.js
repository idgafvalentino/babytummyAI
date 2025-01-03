const fs = require('fs');
const { execSync } = require('child_process');

// Read cursorrules
const cursorRules = JSON.parse(fs.readFileSync('.cursorrules', 'utf8'));
const sessionRules = cursorRules.rules.aiSessionManagement;

async function initSession() {
  console.log('🚀 Initializing new AI session...\n');

  // Run required startup actions
  for (const action of sessionRules.sessionStart.actions) {
    console.log(`Running ${action.tool}...`);
    try {
      execSync(`node src/tools/${action.tool}`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`Failed to run ${action.tool}: ${err.message}`);
    }
  }

  // Load context files
  console.log('\n📚 Loading context files...');
  for (const file of sessionRules.sessionStart.contextFiles) {
    try {
      fs.readFileSync(file.path, 'utf8');
      console.log(`✓ Loaded ${file.path}`);
    } catch (err) {
      console.error(`Failed to load ${file.path}: ${err.message}`);
    }
  }

  // Generate new session handoff file
  const handoffContent = generateHandoff();
  fs.writeFileSync('docs/LAST_SESSION.md', handoffContent);
  console.log('\n✨ Session initialized successfully!');
}

function generateHandoff() {
  const now = new Date().toISOString();
  const gitBranch = execSync('git branch --show-current').toString().trim();
  const lastCommit = execSync('git log -1 --pretty=%B').toString().trim();

  return `# AI Session Handoff Notes

## Session Information
- Date: ${now}
- Branch: ${gitBranch}
- Last Commit: ${lastCommit}

## Project Status
${getProjectStatus()}

## Required Actions
${getRequiredActions()}

## Next Steps
${getNextSteps()}
`;
}

function getProjectStatus() {
  // Read current step from projectManager.js output
  try {
    const status = execSync(
      'node src/tools/projectManager.js --status'
    ).toString();
    return status;
  } catch (err) {
    return '- Failed to get project status';
  }
}

function getRequiredActions() {
  const { steps } = cursorRules.rules.development.incrementalApproach;
  const currentStep = getCurrentStep();
  const requiredFiles = steps[currentStep - 1].files;

  return `### Required Files for Current Step
${requiredFiles.map((file) => `- [ ] ${file}`).join('\n')}`;
}

function getCurrentStep() {
  // This should be implemented to read the current step from project state
  return 4; // Currently hardcoded to Core Features step
}

function getNextSteps() {
  const { steps } = cursorRules.rules.development.incrementalApproach;
  const currentStep = getCurrentStep();
  const nextStep = steps[currentStep];

  if (!nextStep) return '- Project completion and testing';

  return `### Next Step: ${nextStep.name}
${nextStep.files.map((file) => `- ${file}`).join('\n')}`;
}

if (require.main === module) {
  initSession();
}

module.exports = { initSession, generateHandoff };
