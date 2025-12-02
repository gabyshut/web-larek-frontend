const fs = require('fs');
const path = require('path');

const nojekyllPath = path.join(__dirname, 'dist', '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('Created .nojekyll file');