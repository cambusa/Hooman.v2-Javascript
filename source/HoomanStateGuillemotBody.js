// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateGuillemotBody extends HoomanState {
	
	_buffer;
	
	constructor(parser) {
		super(parser);
	}

	get buffer () {
        return this._buffer.join("");
	}

    get name () {
		return "GuillemotBody";
	}

	complete () {

		this.parser.document.guillemotBuffer.push(this.buffer);

	}

    nextSymbol (b) {

		if (b == "\r" || b == "\n") {
			this.parser.changeState(this.parser.stateGuillemotIndentation, b);
		}
        else {
			this._buffer.push(b);
		}

	}

    reset () {
        this._buffer = [];
	}

    finalCheck () {

        // Tested [TestGuillemotEnd4]
		let doc = this.parser.document.namex;
		let line = this.parser.document.row;
		let code = 32;
		let message = "{0}The guillemots have not a closure at row {1}".format(doc, line);
		this.parser.reject({message: message, document: doc, line: line, code: code});
		throw new Error(message);

	}

}
