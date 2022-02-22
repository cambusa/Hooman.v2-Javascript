// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateVariable extends HoomanState {

	_buffer;
	
	constructor(parser) {
		super(parser);
	}

    initialize () {

		this.stateIndentation = this.parser.StateIndentation;
		this.stateAssignment = this.parser.stateAssignment;

	}

    get buffer () {
        return this._buffer.join("");
	}

    get name () {
		return "Variable";
	}

    complete () {

        this.parser.stackManagement(this.buffer);

	}

    nextSymbol (b) {

        if ( ("A" <= b && b <= "Z" ) || ("a" <= b && b <= "z" ) || b == "_" || ("0" <= b && b <= "9" )) {
			this._buffer.push(b);
		}
        else if (b == "\r" || b == "\n") {
			this.parser.changeState(this.parser.stateIndentation, b);
		}
        else if (b == " " || b == "\t") {
			this.parser.changeState(this.parser.stateAssignment, b);
		}
        else{

			// Tested [TestSyntaxErr8]
			let doc = this.parser.document.namex;
			let line = this.parser.document.row;
			let code = 53;
			let message = "{0}Syntax error at row {1}".format(doc, line);
            this.parser.reject({message: message, document: doc, line: line, code: code});
            throw new Error(message);
		
		}

	}

    reset () {
        this._buffer = [];
	}

}
