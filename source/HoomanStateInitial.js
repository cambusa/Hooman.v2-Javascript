// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateInitial extends HoomanState {
	
	constructor(parser) {
		super(parser);
	}

    get name () {
		return "Initial";
	}

    nextSymbol (b) {

        if ( ("A" <= b && b <= "Z" ) || ("a" <= b && b <= "z" ) || b == "_" || ("0" <= b && b <= "9" )) {
			this.parser.changeState(this.parser.stateVariable, b);
		}
        else if (b == "\r" || b == "\n") {
			this.parser.changeState(this.parser.stateIndentation, b);
		}
        else if (b == " " || b == "\t") {
			this.parser.changeState(this.parser.stateIndentation, b);
		}
        else if (b == "\x00" || b == "\xEF" || b == "\xFE" || b == "\xFF" || b == "\xBB") {
			this.parser.changeState(this.parser.stateBOM, b);
		}
        else if (b == "*") {
			this.parser.changeState(this.parser.stateRemark, b);
		}
		else if (b == "+") {
			this.parser.changeState(this.parser.statePlus, null);
		}
        else if (b == "<") {
			this.parser.changeState(this.parser.stateLessThan, b);
		}
        else{

			// Tested [TestUnexpected2]
			let doc = this.parser.document.namex;
			let line = this.parser.document.row;
			let code = 41;
            let message = "{0}Unexpected character at row {1}".format(doc, line);
            this.parser.reject({message: message, document: doc, line: line, code: code});
            throw new Error(message);
		
		}

	}

}
