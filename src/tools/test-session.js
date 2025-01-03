const { initSession } = require('./sessionInit');

async function testSession() {
  console.log('🧪 Testing AI Session Management\n');

  try {
    // 1. Initialize session
    console.log('1. Testing session initialization...');
    await initSession();

    // 2. Verify files were created
    const fs = require('fs');
    const files = [
      'docs/LAST_SESSION.md',
      'docs/devlog.md',
      'docs/AI_COLLABORATION.md',
    ];

    console.log('\n2. Verifying file creation...');
    files.forEach((file) => {
      if (fs.existsSync(file)) {
        console.log(`✓ ${file} exists`);
        const content = fs.readFileSync(file, 'utf8');
        console.log(`  - File size: ${content.length} bytes`);
      } else {
        console.log(`✗ ${file} is missing`);
      }
    });

    // 3. Test project status
    console.log('\n3. Testing project status...');
    const { execSync } = require('child_process');
    const status = execSync('npm run ai:status').toString();
    console.log('Project Status Output:');
    console.log(status);

    console.log('\n✨ Session management test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testSession();
}

module.exports = testSession;
