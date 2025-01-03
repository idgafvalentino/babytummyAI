const fs = require('fs');
const path = require('path');

class ProjectManager {
  constructor() {
    this.projectState = {
      currentStep: 1,
      completedTasks: [],
      pendingTasks: [],
    };
    this.rulesPath = path.join(process.cwd(), '.cursorrules');
    this.collaborationPath = path.join(
      process.cwd(),
      'docs/AI_COLLABORATION.md'
    );
    this.devlogPath = path.join(process.cwd(), 'docs/devlog.md');
    this.lastSessionPath = path.join(process.cwd(), 'docs/LAST_SESSION.md');
  }

  async verifyProjectState() {
    const rules = JSON.parse(
      await fs.promises.readFile(this.rulesPath, 'utf8')
    );
    const steps = rules.rules.development.incrementalApproach.steps;

    // Check each step's files
    for (const step of steps) {
      const completedFiles = [];
      const pendingFiles = [];

      for (const file of step.files) {
        try {
          await fs.promises.access(path.join(process.cwd(), file));
          completedFiles.push(file);
        } catch {
          pendingFiles.push(file);
        }
      }

      if (pendingFiles.length > 0) {
        this.projectState.currentStep = step.order;
        this.projectState.completedTasks = completedFiles;
        this.projectState.pendingTasks = pendingFiles;
        break;
      }
    }

    return this.projectState;
  }

  async updateStatus() {
    const state = await this.verifyProjectState();
    const timestamp = new Date().toISOString();

    // Update AI_COLLABORATION.md
    const collaboration = `# Project Status and Context

## Current Development Step
- Step: ${state.currentStep}
- Status: ${state.pendingTasks.length > 0 ? 'in_progress' : 'completed'}

## Recent Changes
${state.completedTasks.map((task) => `- Completed: ${task}`).join('\n')}

## Next Tasks
${state.pendingTasks.map((task) => `- Pending: ${task}`).join('\n')}

## Project Health
- Database Status: ${await this.checkDatabaseStatus()}
- Test Coverage: Pending
- Outstanding Issues: ${state.pendingTasks.length}
`;

    await fs.promises.writeFile(this.collaborationPath, collaboration);

    // Append to devlog
    const devlogEntry = `\n## ${timestamp}\n- Current Step: ${state.currentStep}\n- Status Update: ${state.pendingTasks.length} tasks remaining\n`;
    await fs.promises.appendFile(this.devlogPath, devlogEntry);
  }

  async generateHandoff() {
    const state = await this.verifyProjectState();
    const handoff = `# Session Handoff Notes
Generated: ${new Date().toISOString()}

## Current Progress
- Development Step: ${state.currentStep}
- Completed Tasks: ${state.completedTasks.length}
- Remaining Tasks: ${state.pendingTasks.length}

## Next Steps
${state.pendingTasks.map((task) => `1. Implement ${task}`).join('\n')}

## Important Notes
- Verify all completed tasks are properly tested
- Update documentation for new implementations
- Run database migrations if needed
`;

    await fs.promises.writeFile(this.lastSessionPath, handoff);
  }

  async checkDatabaseStatus() {
    try {
      const dbCheck = require('../tests/db-check');
      await dbCheck.verifyDatabaseStructure();
      return 'Connected';
    } catch {
      return 'Disconnected';
    }
  }
}

module.exports = new ProjectManager();
