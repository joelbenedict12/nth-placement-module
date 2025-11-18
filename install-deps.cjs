const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Try to find npm in common locations
const possibleNpmPaths = [
  process.env.npm_execpath,
  path.join(process.env.NODE_PATH || '', 'npm'),
  path.join(process.env.APPDATA || '', 'npm', 'npm'),
  'npm',
  'npm.cmd'
];

let npmPath = null;
for (const possiblePath of possibleNpmPaths) {
  if (possiblePath) {
    try {
      execSync(`${possiblePath} --version`, { stdio: 'ignore' });
      npmPath = possiblePath;
      break;
    } catch (e) {
      // Continue to next path
    }
  }
}

if (!npmPath) {
  console.log('Could not find npm. Trying to install using node package manager...');
  
  // Try to use the npm that comes with node
  try {
    const nodeDir = path.dirname(process.execPath);
    npmPath = path.join(nodeDir, 'npm.cmd');
    execSync(`${npmPath} --version`, { stdio: 'ignore' });
  } catch (e) {
    console.error('Could not find npm installation. Please install npm manually.');
    process.exit(1);
  }
}

console.log(`Using npm at: ${npmPath}`);

try {
  console.log('Installing dependencies...');
  execSync(`${npmPath} install`, { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}