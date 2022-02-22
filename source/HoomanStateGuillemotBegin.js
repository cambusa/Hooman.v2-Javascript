// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateGuillemotBegin extends HoomanState {

	_buffer;
	
	constructor(parser) {
		super(parser);
	}

	get buffer () {
        return this._buffer.join("").trim();
	}

    get name () {
		return "GuillemotBegin";
	}

	complete () {

		this.parser.stackLimbs.top.tag = this.buffer;

	}

    nextSymbol (b) {

		if (b == "\r" || b == "\n") {

			this.parser.document.guillemotSession = true;
			this.parser.document.guillemotSkipNewLine = true;
			this.parser.document.guillemotBuffer = [];
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
		let code = 31;
		let message = "{0}The guillemots have not a closure at row {1}".format(doc, line);
		this.parser.reject({message: message, document: doc, line: line, code: code});
		throw new Error(message);

	}

}
