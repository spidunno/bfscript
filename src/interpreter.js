const fs = require('fs');
const wrap = require('wrap-around');

function run(src, memSize=30000, debug=false) {
	/*
	The way BrainF works is something like the following:
		'<': move the pointer one position to the left.
		'>': move the pointer one position to the right.
		'+': increment the byte at the current position by one.
		'-': decrement the byte at the current position by one.
		'.': equivalent to the putchar function in c, gets the current byte and prints it as a character.
		',': equivalent to the getchar function in c, gets a single character from the standard input and stores it into the current byte.
		'[': if the current byte is zero, skips to whatever is after the respective closing bracket, otherwise continue.
		']': if the current byte isn't zero, skips back to whatever is after the opening bracket, otherwise continue.

	There are probably better ways to do what is done in this function, but pfft who needs "good code" or "best practices", these are invented by the ECMA so they can mine for bitcoin on your site with the users javascript interpreter. wake up sheeple.
	*/


	/* this creates a function where, if the user enables debug mode, console.logs the message, otherwise does nothing, mostly for development purposes */
	let sendDebugMessage = (msg) => {if (debug) {console.log(msg)}};
	/* the variable declarations are self explanatory but the while loop is a bit more complicated. the reason it's a while loop is because of the way I handle flow control, because brainf only uses characters of length 1, I don't need to really parse it, but i still need to be able to go back and forth due to how brackets work in brainf, using the while loop lets me control whether or not I want to go forwards in the loop, go back, or skip forwards / backwards.

	TODO: implement an actual parser as a best practice
	*/
	let memory = new Uint8Array(memSize);
	let memoryPos = 0;
	let i = 0;
	while(i < src.length) {
		switch(src[i]) {
			case '<':
				/* Notice the debug log message and the manual incrementing of i

				TODO: stop depending on the wrap-around module
				*/
				memoryPos--;
				memoryPos = wrap(memSize, memoryPos);
				sendDebugMessage(`now at 0x${memoryPos.toString(16)}`);
				i ++;
				break;
			case '>':
				memoryPos++;
				memoryPos = wrap(memSize, memoryPos);
				sendDebugMessage(`now at 0x${memoryPos.toString(16)}`);
				i ++;
				break;
			case '+':
				memory[memoryPos] ++;
				sendDebugMessage(`value at 0x${memoryPos.toString(16)} is now 0x${memory[memoryPos].toString(16)}`);
				i ++;
				break;
			case '-':
				memory[memoryPos] --;
				sendDebugMessage(`value at 0x${memoryPos.toString(16)} is now 0x${memory[memoryPos].toString(16)}`);
				i++;
				break;
			case '.':
				process.stdout.write(String.fromCodePoint(memory[memoryPos]));
				sendDebugMessage(`wrote 0x${memory[memoryPos].toString(16)} (character "${String.fromCodePoint(memory[memoryPos])}") to the standard output`);
				i++;
				break;
			case ',':
				let buf = Buffer.alloc(1);
 				fs.readSync(0, buf, 0, 1);
				let char = buf[0];
				memory[memoryPos] = char;
				sendDebugMessage(`wrote 0x${char.toString(16)} (character "${String.fromCharCode(char)}") to address 0x${memoryPos.toString(16)}`);
				i++;
				break;
			case '[':
				if (memory[memoryPos] == 0) {
					// TODO: find a better method for locating and jumping to the respective bracket
					i = src.indexOf(']', i + 1) + 1;
					sendDebugMessage(`jumped to the closing bracket.`);
					break;
				}
				else {
					i ++;
					break;
				}
			case ']':
				if (memory[memoryPos] != 0) {
					let reversed = [...src].reverse().join('');
					i = (src.length - reversed.indexOf('[', src.length - (i + 1)));
					sendDebugMessage(`jumped to after the last opening bracket`);
					break;
				}
				else {
					i ++;
					break;
				}
			default:
				i++;
				break;
		}
	}
	return memory;
}

module.exports = {
	runBF: run
};