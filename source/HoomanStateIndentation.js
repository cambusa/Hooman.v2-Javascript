// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateIndentation extends HoomanState {
	
    _indentation;
    _spaces;
    _spacesForTab;

	constructor(parser) {
		super(parser);
	}

    initialize () {

		this.stateVariable = this.parser.stateVariable;
		this.stateRemark = this.parser.stateRemark;
		this.stateLessThan = this.parser.stateLessThan;
		this.statePlus = this.parser.statePlus;
		this.stateThen = this.parser.stateThen;

	}

	get name () {
		return "Indentation";
	}


    nextSymbol (b) {

		if ( ("A" <= b && b <= "Z" ) || ("a" <= b && b <= "z" ) || b == "_" || ("0" <= b && b <= "9" )) {
			this.parser.document.indentation = this._indentation;
			this.parser.changeState(this.stateVariable, b);
		}
        else if (b == "*") {
			this.parser.changeState(this.stateRemark, b);
		}
        else if (b == "<") {
			this.parser.document.indentation = this._indentation;
			this.parser.changeState(this.stateLessThan, b);
		}
        else if (b == "+") {
			this.parser.document.indentation = this._indentation;
			this.parser.changeState(this.statePlus, null);
		}
        else if (b == "=") {
			this.parser.document.indentation = this._indentation;
			this.parser.changeState(this.stateThen, b);
		}
        else if (b == " ") {
			
			this._spaces++;

			if (this._spaces == this._spacesForTab) {

				this._spaces = 0;
				this._indentation++;

			}
		
		}
        else if (b == "\r" || b == "\n") {
			this._spaces = 0; 
			this._indentation = 0;
		}
        else if (b == "\t") {
			this._spaces = 0;
			this._indentation++;
		}
        else{

			// Tested [TestSyntaxErr6]
			let doc = this.parser.document.namex;
			let line = this.parser.document.row;
			let code = 40;
			let message = "{0}Syntax error at row {1}".format(doc, line);
            this.parser.reject({message: message, document: doc, line: line, code: code});
            throw new Error(message);
		
		}

	}

    reset () {

        this._indentation = 0;
        this._spaces = 0;
        this._spacesForTab = this.parser.document.spacesForTab;

	}

}
