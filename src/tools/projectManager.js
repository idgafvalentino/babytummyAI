const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class ProjectManager {
  constructor() {
    try {
      this.rules = JSON.parse(fs.readFileSync('.cursorrules', 'utf8'));
      this.devLogPath = 'docs/devlog.md';
      this.statusFile = path.join(__dirname, '../../.project-status.json');
      this.currentStep = this.determineCurrentStep();
    } catch (error) {
      console.error(chalk.red('Error initializing ProjectManager:'), error);
      process.exit(1);
    }
  }

  determineCurrentStep() {
    const steps = this.rules.rules.development.incrementalApproach.steps;
    let lastCompletedStep = steps[0];

    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i];
      const completed = this.validateStep(currentStep);

      if (!completed) {
        // Return current incomplete step
        return currentStep;
      }

      lastCompletedStep = currentStep;

      // If we're at the last step and it's complete, return it
      if (i === steps.length - 1) {
        return lastCompletedStep;
      }

      // Check if next step's prerequisites are met
      const nextStep = steps[i + 1];
      const nextStepValid = this.validateStep(nextStep);

      if (!nextStepValid) {
        return nextStep;
      }
    }

    return lastCompletedStep;
  }

  updateProjectStatus() {
    try {
      // Clean up devlog first
      this.cleanupDevLog();

      // Force a fresh determination of current step
      this.currentStep = this.determineCurrentStep();

      const status = {
        currentStep: this.currentStep.order,
        stepName: this.currentStep.name,
        lastUpdated: new Date().toISOString(),
        completedFiles: this.getCompletedFiles(),
        nextActions: this.generateNextActions(this.currentStep),
        validationState: {
          filesExist: this.validateStep(this.currentStep),
          docsSync: this.verifyDocumentationSync(),
        },
      };

      this.validateStatusObject(status);
      fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
      this.updateDevLog(this.currentStep);

      return status;
    } catch (error) {
      console.error(chalk.red('Error updating project status:'), error);
      throw error;
    }
  }

  getCompletedFiles() {
    return this.currentStep.files.filter((file) =>
      fs.existsSync(file.replace('/*', ''))
    );
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

### AI Collaboration
- Reference: docs/AI_COLLABORATION.md
- Current Step: "${currentStep.name}"
- Files: ${currentStep.files.join(', ')}

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
    return report.trim();
  }

  // Generate next actions
  generateNextActions(step) {
    const missingFiles = step.files.filter(
      (file) => !fs.existsSync(file.replace('/*', ''))
    );
    return missingFiles.length > 0
      ? missingFiles.map((file) => `1. Create/Complete ${file}`).join('\n')
      : 'All required files are present.';
  }

  validateStatusObject(status) {
    const requiredFields = [
      'currentStep',
      'stepName',
      'lastUpdated',
      'completedFiles',
      'nextActions',
    ];
    const missingFields = requiredFields.filter((field) => !(field in status));

    if (missingFields.length > 0) {
      throw new Error(
        `Invalid status object. Missing fields: ${missingFields.join(', ')}`
      );
    }

    if (typeof status.currentStep !== 'number' || status.currentStep < 1) {
      throw new Error('Invalid currentStep value');
    }

    if (!Array.isArray(status.completedFiles)) {
      throw new Error('completedFiles must be an array');
    }

    const validSteps =
      this.rules.rules.development.incrementalApproach.steps.map(
        (step) => step.order
      );

    if (!validSteps.includes(status.currentStep)) {
      throw new Error(`Invalid step number: ${status.currentStep}`);
    }
  }

  verifyProjectState() {
    try {
      console.log(chalk.blue('\n🔍 Running Project State Verification\n'));

      // 1. Check .project-status.json
      const statusExists = fs.existsSync(this.statusFile);
      console.log(
        chalk.yellow('Status File:'),
        statusExists ? chalk.green('✓ Found') : chalk.red('✗ Missing')
      );

      if (statusExists) {
        const status = JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
        console.log(
          chalk.yellow('Current Step:'),
          chalk.cyan(`${status.currentStep} - ${status.stepName}`)
        );
      }

      // 2. Verify Required Files for Current Step
      console.log(chalk.yellow('\nRequired Files:'));
      const requiredFiles = this.currentStep.files;
      requiredFiles.forEach((file) => {
        const exists = fs.existsSync(file.replace('/*', ''));
        console.log(exists ? chalk.green(`✓ ${file}`) : chalk.red(`✗ ${file}`));
      });

      // 3. Check Documentation Sync
      console.log(chalk.yellow('\nDocumentation Status:'));
      const docsSync = this.verifyDocumentationSync();

      return {
        statusFile: statusExists,
        currentStep: this.currentStep,
        requiredFiles: requiredFiles.map((file) => ({
          file,
          exists: fs.existsSync(file.replace('/*', '')),
        })),
        docsSync,
      };
    } catch (error) {
      console.error(chalk.red('Error during verification:'), error);
      throw error;
    }
  }

  verifyDocumentationSync() {
    const results = {
      devlog: fs.existsSync(this.devLogPath),
      aiCollab: fs.existsSync('docs/AI_COLLABORATION.md'),
      authChecklist: fs.existsSync('docs/checklists/auth-implementation.md'),
    };

    console.log(
      results.devlog ? chalk.green('✓ devlog.md') : chalk.red('✗ devlog.md')
    );
    console.log(
      results.aiCollab
        ? chalk.green('✓ AI_COLLABORATION.md')
        : chalk.red('✗ AI_COLLABORATION.md')
    );
    console.log(
      results.authChecklist
        ? chalk.green('✓ auth-implementation.md')
        : chalk.red('✗ auth-implementation.md')
    );

    return results;
  }

  cleanupDevLog() {
    if (!fs.existsSync(this.devLogPath)) {
      return;
    }

    const content = fs.readFileSync(this.devLogPath, 'utf8');
    const sections = content.split(
      '## [Auto-generated entries will appear below]'
    );

    if (sections.length >= 2) {
      // Keep header and remove duplicate entries
      const newContent =
        sections[0] + '## [Auto-generated entries will appear below]\n\n';
      fs.writeFileSync(this.devLogPath, newContent);
    }
  }
}

// Create instance and check status
const manager = new ProjectManager();
manager.updateProjectStatus(); // Force sync first
manager.checkStatus(); // Then check status
manager.verifyProjectState(); // Finally verify

module.exports = ProjectManager;
