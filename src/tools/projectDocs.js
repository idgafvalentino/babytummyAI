const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class ProjectDocumentationManager {
  constructor() {
    this.projectManager = require('./projectManager');
    this.pm = new this.projectManager();
    this.lastSessionFile = '.last-session.json';
    this.aiContextFile = 'docs/AI_CONTEXT.md';
  }

  generateAIContext() {
    const status = this.pm.updateProjectStatus();
    const context = {
      timestamp: new Date().toISOString(),
      currentStep: status.currentStep,
      stepName: status.stepName,
      recentChanges: this.getRecentChanges(),
      projectState: this.getProjectState(),
      nextActions: status.nextActions,
      warnings: this.checkForWarnings(),
    };

    this.saveContext(context);
    return context;
  }

  getRecentChanges() {
    try {
      const lastSession = JSON.parse(
        fs.readFileSync(this.lastSessionFile, 'utf8')
      );
      const changes = {
        newFiles: [],
        modifiedFiles: [],
        deletedFiles: [],
      };

      // Compare current files with last session
      const currentFiles = this.getAllProjectFiles();
      const lastFiles = lastSession.files || {};

      for (const [file, hash] of Object.entries(currentFiles)) {
        if (!lastFiles[file]) {
          changes.newFiles.push(file);
        } else if (lastFiles[file] !== hash) {
          changes.modifiedFiles.push(file);
        }
      }

      for (const file of Object.keys(lastFiles)) {
        if (!currentFiles[file]) {
          changes.deletedFiles.push(file);
        }
      }

      return changes;
    } catch (error) {
      // First run or error reading last session
      return { newFiles: [], modifiedFiles: [], deletedFiles: [] };
    }
  }

  getProjectState() {
    return {
      structure: this.validateProjectStructure(),
      dependencies: this.checkDependencies(),
      documentation: this.validateDocumentation(),
      tests: this.checkTestCoverage(),
    };
  }

  validateProjectStructure() {
    const issues = [];
    const rules = this.pm.rules.rules;

    // Check directory structure
    for (const [dirName, config] of Object.entries(rules.directories)) {
      if (!fs.existsSync(dirName)) {
        issues.push(`Missing directory: ${dirName}`);
        continue;
      }

      // Check required files
      if (config.required) {
        for (const file of config.required) {
          const filePath = path.join(dirName, file);
          if (!fs.existsSync(filePath)) {
            issues.push(`Missing required file: ${filePath}`);
          }
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  checkDependencies() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return {
        valid: true,
        dependencies: packageJson.dependencies,
        devDependencies: packageJson.devDependencies,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Unable to read package.json',
      };
    }
  }

  validateDocumentation() {
    const docFiles = [
      'README.md',
      'docs/API_ENDPOINTS.md',
      'docs/database.md',
      this.aiContextFile,
    ];

    const status = {};
    for (const file of docFiles) {
      status[file] = fs.existsSync(file);
    }

    return status;
  }

  checkTestCoverage() {
    const testDir = 'src/tests';
    if (!fs.existsSync(testDir)) {
      return { valid: false, error: 'No tests directory found' };
    }

    const testFiles = fs
      .readdirSync(testDir)
      .filter((file) => file.endsWith('.test.js'));

    return {
      valid: testFiles.length > 0,
      testFiles,
    };
  }

  checkForWarnings() {
    const warnings = [];

    // Check for duplicate files
    this.findDuplicateFiles(warnings);

    // Check for outdated dependencies
    this.checkOutdatedDependencies(warnings);

    // Check for incomplete features
    this.checkIncompleteFeatures(warnings);

    return warnings;
  }

  findDuplicateFiles(warnings) {
    const fileMap = new Map();
    this.getAllProjectFiles((file) => {
      const baseName = path.basename(file);
      if (fileMap.has(baseName)) {
        warnings.push(
          `Possible duplicate file: ${baseName} in ${file} and ${fileMap.get(
            baseName
          )}`
        );
      } else {
        fileMap.set(baseName, file);
      }
    });
  }

  checkOutdatedDependencies(warnings) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      for (const [dep, version] of Object.entries(deps)) {
        if (version.startsWith('^') || version.startsWith('~')) {
          warnings.push(`Dependency ${dep} uses loose version: ${version}`);
        }
      }
    } catch (error) {
      warnings.push('Unable to check dependencies');
    }
  }

  checkIncompleteFeatures(warnings) {
    const currentStep = this.pm.currentStep;
    const incompleteFiles = currentStep.files.filter(
      (file) => !fs.existsSync(file.replace('/*', ''))
    );

    if (incompleteFiles.length > 0) {
      warnings.push(
        `Incomplete features in step ${
          currentStep.order
        }: ${incompleteFiles.join(', ')}`
      );
    }
  }

  getAllProjectFiles(callback) {
    const files = {};
    const ignoreDirs = ['node_modules', '.git'];

    function walkDir(dir) {
      const entries = fs.readdirSync(dir);

      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        if (ignoreDirs.some((ignore) => fullPath.includes(ignore))) continue;

        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else {
          if (callback) {
            callback(fullPath);
          } else {
            const content = fs.readFileSync(fullPath);
            files[fullPath] = require('crypto')
              .createHash('md5')
              .update(content)
              .digest('hex');
          }
        }
      }
    }

    walkDir('.');
    return files;
  }

  saveContext(context) {
    // Save current session state
    fs.writeFileSync(
      this.lastSessionFile,
      JSON.stringify(
        {
          timestamp: context.timestamp,
          files: this.getAllProjectFiles(),
        },
        null,
        2
      )
    );

    // Generate AI context markdown
    const contextMd = this.generateContextMarkdown(context);
    fs.writeFileSync(this.aiContextFile, contextMd);
  }

  generateContextMarkdown(context) {
    return `# AI Development Context
> Last Updated: ${context.timestamp}

## Current Development Stage
- Step ${context.currentStep}: ${context.stepName}

## Recent Changes
${this.formatChanges(context.recentChanges)}

## Project State
${this.formatProjectState(context.projectState)}

## Next Actions
${context.nextActions}

## Warnings
${this.formatWarnings(context.warnings)}

## Development Guidelines
1. Follow the project structure defined in .cursorrules
2. Ensure all new features have corresponding tests
3. Update documentation for any API changes
4. Maintain consistent naming conventions
5. Check for and resolve any warnings before proceeding
`;
  }

  formatChanges(changes) {
    let md = '';
    if (changes.newFiles.length > 0) {
      md +=
        '\n### New Files\n' + changes.newFiles.map((f) => `- ${f}`).join('\n');
    }
    if (changes.modifiedFiles.length > 0) {
      md +=
        '\n### Modified Files\n' +
        changes.modifiedFiles.map((f) => `- ${f}`).join('\n');
    }
    if (changes.deletedFiles.length > 0) {
      md +=
        '\n### Deleted Files\n' +
        changes.deletedFiles.map((f) => `- ${f}`).join('\n');
    }
    return md || 'No recent changes';
  }

  formatProjectState(state) {
    return `
### Structure
${state.structure.valid ? '✅ Valid' : '❌ Issues Found'}
${
  state.structure.issues
    ? state.structure.issues.map((i) => `- ${i}`).join('\n')
    : ''
}

### Dependencies
${state.dependencies.valid ? '✅ Valid' : '❌ Issues Found'}

### Documentation
${Object.entries(state.documentation)
  .map(([file, exists]) => `- ${exists ? '✅' : '❌'} ${file}`)
  .join('\n')}

### Tests
${state.tests.valid ? '✅ Tests Present' : '❌ No Tests Found'}
${
  state.tests.testFiles
    ? state.tests.testFiles.map((f) => `- ${f}`).join('\n')
    : ''
}
`;
  }

  formatWarnings(warnings) {
    return warnings.length > 0
      ? warnings.map((w) => `- ⚠️ ${w}`).join('\n')
      : 'No warnings found';
  }
}

// Create CLI interface
if (require.main === module) {
  const manager = new ProjectDocumentationManager();
  console.log(chalk.blue('\n📊 Generating AI Context...\n'));
  const context = manager.generateAIContext();
  console.log(
    chalk.green(`✅ AI Context generated and saved to ${manager.aiContextFile}`)
  );
  console.log(chalk.yellow('\nWarnings:'));
  context.warnings.forEach((w) => console.log(chalk.yellow(`⚠️  ${w}`)));
}

module.exports = ProjectDocumentationManager;
