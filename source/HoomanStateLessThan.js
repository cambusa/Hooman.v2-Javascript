// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateLessThan extends HoomanState {
	
	_buffer;

	constructor(parser) {
		super(parser);
	}

    get name () {
		return "LessThan";
	}

    nextSymbol (b) {

        let prefix;
		let message;
		let doc;
		let line;
		let code;

		switch (b) {

            case "<":
			case "-":
			case " ":		
			case "\t":
				break;

            case "\r":
			case "\n":

                // Tested [TestSyntaxErr2]
				doc = this.parser.document.namex;
				line = this.parser.document.row;
				code = 42;
				message = "{0}Syntax error at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
	
            default:

                // Tested [TestUnexpected]
				doc = this.parser.document.namex;
				line = this.parser.document.row;
				code = 43;
				message = "{0}Unexpected character at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
	
        }

        this._buffer.push(b);

        switch (this._buffer.length) {

            case 1:
				
				break;

            case 2:

                if (this._buffer.join("") == "<<") {

					if (this.parser.document.indentation == this.parser.stackLimbs.top.level + 1) {

						this.parser.changeState(this.parser.stateGuillemotBegin, null);

					}
					else {
					
						// Tested [TestWrongIndentationGuillemot2]
						let doc = this.parser.document.namex;
						let line = this.parser.document.row;
						let code = 44;
						let message = "{0}Wrong indentation at row {1}".format(doc, line);
						this.parser.reject({message: message, document: doc, line: line, code: code});
						throw new Error(message);
								
					}

				}

				break;

            case 3:

				break;

            case 4:

                prefix =this._buffer.join("");

                if (prefix == "<-- " || prefix == "<--\t") {

					if (this.parser.document.guillemotSession) {
						this.parser.changeState(this.parser.stateIncludeText, null);
					}
					else {
						this.parser.changeState(this.parser.stateIncludeSub, null);
					}

				}
				
				break;

            default:

                // Tested [TestSyntaxErr]
				let doc = this.parser.document.namex;
				let line = this.parser.document.row;
				let code = 45;
				let message = "{0}Syntax error at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
	
		}

	}

    reset () {
        this._buffer = [];
	}

    finalCheck () {

        // Tested [TestSyntaxErr3]
		let doc = this.parser.document.namex;
		let line = this.parser.document.row;
		let code = 46;
		let message = "{0}Syntax error at row {1}".format(doc, line);
		this.parser.reject({message: message, document: doc, line: line, code: code});
		throw new Error(message);

	}


}
