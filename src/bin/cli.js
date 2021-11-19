#!/usr/bin/env node

const run = require('../interpreter.js').runBF;
const equal = require('deep-equal');
const fs = require('fs');

if (equal(process.argv.slice(2), [])) {
	console.log(`
USAGE: npx spidf [FILE] [DEBUGMODE=false] [MEMORYOUTFILE]

EXAMPLE: npx spidf main.bf false out.txt
		`);
	process.exit();
}
let output = [...run(fs.readFileSync(process.argv[2]).toString(), memSize=131070, debug=process.argv[3]=='true')].map(_=>_.toString(16).padStart(2,0)).join(' ');
if (typeof process.argv[4] !== "undefined") {
	fs.writeFileSync(process.argv[4], output);
}