const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class ProjectManager {
  constructor() {
    this.rules = JSON.parse(fs.readFileSync('.cursorrules', 'utf8'));
    this.devLogPath = 'docs/devlog.md';
    this.currentStep = 1;
  }

  // Check project status
  checkStatus() {
    console.log(chalk.blue('\n📊 Project Status Check\n'));

    const steps = this.rules.rules.development.incrementalApproach.steps;
    let currentStep = steps[0];

    for (const step of steps) {
      const completed = this.validateStep(step);
      if (!completed) {
        currentStep = step;
        break;
      }
    }

    this.displayProgress(currentStep);
    this.updateDevLog(currentStep);
  }

  // Validate if a step is complete
  validateStep(step) {
    let completed = true;
    for (const file of step.files) {
      if (file.includes('*')) {
        // Handle directory checks
        const dir = path.dirname(file);
        if (!fs.existsSync(dir)) {
          completed = false;
          break;
        }
      } else {
        // Handle specific file checks
        if (!fs.existsSync(file)) {
          completed = false;
          break;
        }
      }
    }
    return completed;
  }

  // Display current progress
  displayProgress(currentStep) {
    console.log(
      chalk.yellow(`Current Step (${currentStep.order}): ${currentStep.name}\n`)
    );
    console.log('Required Files:');
    currentStep.files.forEach((file) => {
      const exists = fs.existsSync(file.replace('/*', ''));
      console.log(exists ? chalk.green(`✓ ${file}`) : chalk.red(`✗ ${file}`));
    });
  }

  // Update development log
  updateDevLog(currentStep) {
    if (!fs.existsSync(this.devLogPath)) {
      this.initializeDevLog();
    }

    const today = new Date().toISOString().split('T')[0];
    const logEntry = `
## ${today} - Step ${currentStep.order}: ${currentStep.name}

### Status
${this.generateStatusReport(currentStep)}

### Next Actions
${this.generateNextActions(currentStep)}

### Notes for AI Assistance
- When asking for help, mention you're working on: "${currentStep.name}"
- Reference specific files from: ${currentStep.files.join(', ')}
- Ask for validation against .cursorrules structure

---
`;

    fs.appendFileSync(this.devLogPath, logEntry);
  }

  // Initialize dev log
  initializeDevLog() {
    const header = `# Development Log

> This log is automatically updated by projectManager.js
> Manual entries should follow the same format

## Getting Started

### How to Use This Log
1. Run status check: \`node src/tools/projectManager.js\`
2. Review current step and requirements
3. Add manual notes under each auto-generated entry
4. Mark completed items with ✅

### Working with AI
- Always mention current step when asking questions
- Reference specific files from .cursorrules
- Ask AI to validate against project structure

---

## [Auto-generated entries will appear below]

`;
    fs.writeFileSync(this.devLogPath, header);
  }

  // Generate status report
  generateStatusReport(step) {
    let report = '';
    step.files.forEach((file) => {
      const exists = fs.existsSync(file.replace('/*', ''));
      report += `- ${exists ? '✅' : '⏳'} ${file}\n`;
    });
    return report;
  }

  // Generate next actions
  generateNextActions(step) {
    const missingFiles = step.files.filter(
      (file) => !fs.existsSync(file.replace('/*', ''))
    );

    return missingFiles.map((file) => `1. Create/Complete ${file}`).join('\n');
  }
}

// Run status check
const manager = new ProjectManager();
manager.checkStatus();

module.exports = ProjectManager;
