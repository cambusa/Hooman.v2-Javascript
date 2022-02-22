// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateThen extends HoomanState {

    _buffer;
    _separator;
	
	constructor(parser) {
		super(parser);
	}

    get buffer () {
        return this._buffer.join("");
	}

	get name () {
		return "Then";
	}

    complete () {
        this.parser.thenOccurred = true;
	}

    nextSymbol (b) {

        switch (b) {

        case "\r":
		case "\n":

			if (this._buffer.join("") != "==>") {
			
				// Tested [TestSyntaxErr4]
				let doc = this.parser.document.namex;
				let line = this.parser.document.row;
				let code = 49;
				let message = "{0}Syntax error at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
				
			}

			this.parser.changeState(this.parser.stateIndentation, b);

			break;

		case " ":
		case "\t":

			this._separator = true;
			break;

        default:

			if (this._separator) {
				
				// Tested [TestSyntaxErr5]
				let doc = this.parser.document.namex;
				let line = this.parser.document.row;
				let code = 50;
				let message = "{0}Syntax error at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
				
			}

			this._buffer.push(b);

		}

	}

    reset () {

        this._buffer = [];
		this._separator = false;

	}

}
