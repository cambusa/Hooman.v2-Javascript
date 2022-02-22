// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStatePlus extends HoomanState {
	
	_buffer;

	constructor(parser) {
		super(parser);
	}

    initialize () {

		this.stateIndentation = this.parser.stateIndentation;
		this.stateAssignment = this.parser.stateAssignment;

	}

    get buffer () {
        return this._buffer.join("");
	}

	get name () {
		return "Plus";
	}


    complete () {
        this.parser.stackManagement("+");
	}

    nextSymbol (b) {

        switch (b) {

        case "\r":
		case "\n":

			this.parser.changeState(this.stateIndentation, b);
			break;

        case " ":
		case "\t":

			this.parser.changeState(this.stateAssignment, b);
			break;

        default:

			// Tested [TestUnexpected3]
			let doc = this.parser.document.namex;
			let line = this.parser.document.row;
			let code = 47;
			let message = "{0}Unexpected character at row {1}".format(doc, line);
            this.parser.reject({message: message, document: doc, line: line, code: code});
            throw new Error(message);

		}

	}

    reset () {
        this._buffer = [];
	}

}
