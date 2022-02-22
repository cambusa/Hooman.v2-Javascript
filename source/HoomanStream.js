// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanStream {
	
	constructor(bytes) {
		this.bytes = bytes;
		this.cursor = -1;
	}
	
	getNext () {
		this.cursor += 1;
		if (this.cursor < this.bytes.length) {
			return this.bytes[this.cursor];
		}
		else {
			return "";
		}
	}
	
}
