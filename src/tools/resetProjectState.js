const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function resetProjectState() {
  try {
    console.log(chalk.blue('\n🔄 Resetting Project State...\n'));

    // 1. Reset status file
    const statusFile = path.join(__dirname, '../../.project-status.json');
    const newStatus = {
      currentStep: 1,
      stepName: 'Basic Setup',
      lastUpdated: new Date().toISOString(),
      completedFiles: ['src/app.js', '.env', 'package.json'],
      nextActions: 'All required files are present.',
      validationState: {
        filesExist: true,
        docsSync: true,
      },
    };
    fs.writeFileSync(statusFile, JSON.stringify(newStatus, null, 2));
    console.log(chalk.green('✓ Status file reset'));

    // 2. Clean up devlog
    const devlogPath = path.join(__dirname, '../../docs/devlog.md');
    const devlogHeader = `# Development Log

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

## ${new Date().toISOString().split('T')[0]} - Step 1: Basic Setup

### Status
- ✅ src/app.js
- ✅ .env
- ✅ package.json

### Next Actions
All required files are present.

### AI Collaboration
- Reference: docs/AI_COLLABORATION.md
- Current Step: "Basic Setup"
- Files: src/app.js, .env, package.json

---`;
    fs.writeFileSync(devlogPath, devlogHeader);
    console.log(chalk.green('✓ Dev log reset'));

    // 3. Update AI_COLLABORATION.md
    const aiCollabPath = path.join(__dirname, '../../docs/AI_COLLABORATION.md');
    const aiCollabContent = `# Current Development Status

## Session Context

- Current Step: 1 (Basic Setup)
- Branch: main
- Last Update: ${new Date().toISOString().split('T')[0]}

## Implementation Status

1. Current Setup
   - ✅ Project structure initialized
   - ✅ Basic configuration files
   - ✅ Development environment setup

2. Next Implementation
   - Task: Database Models Setup
   - Primary Files:
     - src/models/*
   - Dependencies:
     - PostgreSQL
     - Sequelize ORM

3. Implementation Order
   - [x] Initialize project structure
   - [x] Set up configuration files
   - [x] Configure development environment
   - [ ] Proceed to database models setup

## Questions/Decisions Needed
1. Database schema design
2. Model relationships
3. Data validation rules`;

    fs.writeFileSync(aiCollabPath, aiCollabContent);
    console.log(chalk.green('✓ AI collaboration doc reset'));

    console.log(
      chalk.blue('\n✨ Project state successfully reset to Step 1\n')
    );
  } catch (error) {
    console.error(chalk.red('Error resetting project state:'), error);
    process.exit(1);
  }
}

// Execute reset
resetProjectState();

module.exports = resetProjectState;
