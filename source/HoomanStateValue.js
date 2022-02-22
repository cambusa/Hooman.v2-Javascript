// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";
import {HoomanStatics} from "./HoomanStatics.js";

export class HoomanStateValue extends HoomanState {
	
	_buffer;

	constructor(parser) {
		super(parser);
	}

    initialize () {
		this.stateIndentation = this.parser.StateIndentation;
	}

    get buffer () {
        return this._buffer.join("").trim();
	}

    get name () {
		return "Value";
	}

    complete () {

        var value = this.buffer;

		var currDocRef = this.parser.document.docRef;
		var objTop = this.parser.stackLimbs.top;

		if (objTop.valueType == HoomanStatics.typeComplex) {

			if (value == "@") {

				//---------------------------------------------------------------
				// Controllo che non vi siano variabili locked tra i discendenti
				//---------------------------------------------------------------

				this._checkLocked(objTop.complexValue, currDocRef, this.parser.document.row);

				objTop.prune();

			}

		}
		else if (objTop.owner != currDocRef) {
			if (this.parser.includedDocuments[objTop.owner].locked) {

				// Tested [TestAccessViolation]
				let doc = this.parser.includedDocuments[currDocRef].tagName;
				let line = objTop.row;
				let code = 51;
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

    _checkLocked (limbs, currDocRef, row) {

        for (let l of limbs) {

            if (l.valueType == HoomanStatics.typeComplex) {

                this._checkLocked(l.complexValue, currDocRef, row);
			
			}
            else if (l.owner != currDocRef) {

                if (this.parser.includedDocuments[l.owner].locked) {

                    // Tested [TestPruneWithLocked]
					let doc = this.parser.includedDocuments[currDocRef].tagName;
					let line = row;
					let code = 52;
					let message = "{0}Access violation at row {1}".format(doc, line);
					this.parser.reject({message: message, document: doc, line: line, code: code});
					throw new Error(message);
						
				}

			}

		}

	}

    nextSymbol (b) {

		if (b == "\r" || b == "\n") {
			this.parser.changeState(this.parser.stateIndentation, b);
		}
        else{
			this._buffer.push(b);
		}

	}

    reset () {
        this._buffer = [];
	}

}
