// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateGuillemotEnd extends HoomanState {
	
	_buffer;
	
	constructor(parser) {
		super(parser);
	}

	get buffer () {
        return this._buffer.join("");
	}

    get name () {
		return "GuillemotEnd";
	}

	complete () {

		var value = this.parser.document.guillemotBuffer.join("");

		var currDocRef = this.parser.document.docRef;
		var objTop = this.parser.stackLimbs.top;

		if (objTop.owner != currDocRef) {

			if (this.parser.includedDocuments[objTop.owner].locked) {

				// Tested [TestAccessViolationGuillemot]
				let doc = this.parser.includedDocuments[currDocRef].tagName;
				let line = objTop.row;
				let code = 33;
				let message = "{0}Access violation at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
	
			}
			else {
			
				objTop.simpleValue = value;
			
			}

		}
		else {

			objTop.simpleValue = value;

		}

		this.parser.currentPhase.valueManagement(value);

	}

    nextSymbol (b) {

		if (b == ">") {
			this._buffer.push(b);
		}
		else if (b == "\r" || b == "\n") {

			if (this._buffer.join("") == ">>") {

				this.parser.document.guillemotSession = false;
				this.parser.changeState(this.parser.stateIndentation, b);

			}
			else {

				// Tested [TestGuillemotEnd2]
				let doc = this.parser.document.namex;
				let line = this.parser.document.row;
				let code = 34;
				let message = "{0}Syntax error at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
	
			}

		}
		else if (b == " " || b == "\t") {

		}
		else {

			// Tested [TestGuillemotEnd]
			let doc = this.parser.document.namex;
			let line = this.parser.document.row;
			let code = 35;
			let message = "{0}Unexpected character at row {1}".format(doc, line);
            this.parser.reject({message: message, document: doc, line: line, code: code});
            throw new Error(message);

		}

	}

    reset () {
        this._buffer = [];
	}

}
