// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateRemark extends HoomanState {
	
    _buffer;
    _flagPrefix;

	constructor(parser) {
		super(parser);
	}

    get buffer () {
        return this._buffer.join("");
	}

	get name () {
		return "Remark";
	}

    nextSymbol (b) {

        if (this._flagPrefix) {

			if (b == "\r" || b == "\n") {

				if (this.parser.document.guillemotSession) {
					this.parser.document.guillemotSkipNewLine = true;
					this.parser.changeState(this.parser.stateGuillemotIndentation, b);
				}
				else {
					this.parser.changeState(this.parser.stateIndentation, b);
				}

			}			
		}
        else {

            this._buffer.push(b);

            var prefix = this.buffer;

            if (prefix == "***") {

                this._flagPrefix = true;

			}
			else if (!("***".startsWith(prefix))) {

                // Tested [TestSyntaxErr7]
				let doc = this.parser.document.namex;
				let line = this.parser.document.row;
				let code = 48;
				let message = "{0}Syntax error at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
	
			}

		}
	}

    reset () {

		this._buffer = [];
		this._flagPrefix = false;

	}

}
