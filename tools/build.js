const { execSync } = require('child_process');
const path = require('path');

const { removeSync } = require('fs-extra');

const DIST_DIR = path.join(__dirname, '../dist');
const TS_CONFIG = path.join(__dirname, '../tsconfig.lib.json');

removeSync(DIST_DIR);

execSync(`tsc --project ${TS_CONFIG}`);
