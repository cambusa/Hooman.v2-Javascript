// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateGuillemotIndentation extends HoomanState {
	
    _indentation;
    _spaces;

    _spacesForTab;
    _docIndentation;

	constructor(parser) {
		super(parser);
	}

    get name () {
		return "GuillemotIndentation";
	}

    nextSymbol (b) {

		if (b == "\r" || b == "\n") {

			this._spaces = 0;
            this._indentation = this.parser.document.offset;

		}
		else if (b == " ") {

			this._spaces++;

			if (this._spaces == this._spacesForTab) {

				this._spaces = 0;
				this._indentation++;

			}

		}
		else if (b == "\t") {

			this._spaces = 0;
            this._indentation++;
		
		}
		else if (b == "*") {

			this.parser.changeState(this.parser.stateRemark, b);

		}
		else if (b == "<") {

                if (this._indentation == this._docIndentation) {

					this.parser.changeState(this.parser.stateLessThan, b);
				
				}
                else {

                    // Tested [TestWrongIndentationGuillemot3]
					let doc = this.parser.document.namex;
					let line = this.parser.document.row;
					let code = 36;
					let message = "{0}Wrong indentation at row {1}".format(doc, line);
					this.parser.reject({message: message, document: doc, line: line, code: code});
					throw new Error(message);
		
				}

		}
		else if (b == ">") {

			if (this._indentation == this._docIndentation) {

				this.parser.changeState(this.parser.stateGuillemotEnd, b);

			}
			else {

				// Tested [TestWrongIndentationGuillemot]
				let doc = this.parser.document.namex;
				let line = this.parser.document.row;
				let code = 37;
				let message = "{0}Wrong indentation at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
	
			}

		}
		else {

			// Tested [TestGuillemotEnd6]
			let doc = this.parser.document.namex;
			let line = this.parser.document.row - 1;
			let code = 38;
			let message = "{0}The guillemots have not a closure at row {1}".format(doc, line);
            this.parser.reject({message: message, document: doc, line: line, code: code});
            throw new Error(message);

		}

        if (this._indentation > this._docIndentation) {

			// L'accapo dopo i guillemot o i remark non va incluso nel valore
			if (this.parser.document.guillemotSkipNewLine) {
				this.parser.document.guillemotSkipNewLine = false;
			}
			else {
				this.parser.document.guillemotBuffer.push("\n");
			}

			this.parser.changeState(this.parser.stateGuillemotBody, null);

		}

    }

    reset () {

        this._spaces = 0;

		this._indentation = this.parser.document.offset;
		this._spacesForTab = this.parser.document.spacesForTab;
		this._docIndentation = this.parser.document.indentation;

	}

    finalCheck () {

        // Tested [TestGuillemotEnd3]
		let doc = this.parser.document.namex;
		let line = this.parser.document.row;
		let code = 39;
		let message = "{0}The guillemots have not a closure at row {1}".format(doc, line);
		this.parser.reject({message: message, document: doc, line: line, code: code});
		throw new Error(message);

	}

}
