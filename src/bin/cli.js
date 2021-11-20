#!/usr/bin/env node

// const run = require('../interpreter.js').runBF;
import * as bf from '../interpreter.js';
import equal from 'deep-equal';
import * as fs from 'fs';

if (equal(process.argv.slice(2), [])) {
	console.log(`
USAGE: npx spidf [FILE] [DEBUGMODE=false] [MEMORYOUTFILE]

EXAMPLE: npx spidf main.bf false out.txt
		`);
	process.exit();
}
let output = [...bf.run(fs.readFileSync(process.argv[2]).toString(), 131070, process.argv[3]=='true')].map(_=>_.toString(16).padStart(2,0)).join(' ');
if (typeof process.argv[4] !== "undefined") {
	fs.writeFileSync(process.argv[4], output);
}