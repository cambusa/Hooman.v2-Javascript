// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";
import {HoomanStream} from "./HoomanStream.js";

export class HoomanStateIncludeText extends HoomanState {

	_buffer;
	
	constructor(parser) {
		super(parser);
	}

    get buffer () {
        return this._buffer.join("");
	}

	get name () {
		return "IncludeText";
	}

    complete () {

        var name = this.buffer;
		var parser = this.parser;

		parser.embodiment.getContents(name) //
		.then( data => {

			try {

				let streamIn = new HoomanStream(data);

				var notInitialized = true;
				var newLineCharacter = "\n";
				var newLineExcluded = "\r";
		
				var buffer = [];
				buffer.push("\n");
	
				do {
	
					let currChar = streamIn.getNext();
		
					if (currChar == "") {
						break;
					}
	
					if (notInitialized) {
	
						if (currChar == "\n") {
	
							newLineCharacter = "\n";
							newLineExcluded = "\r"; 
							notInitialized = false;
						}
						else if (currChar == "\r") {
	
							newLineCharacter = "\r";
							newLineExcluded = "\n";
							notInitialized = false;
	
						}
	
					}
	
					if (currChar != newLineExcluded) {
						if (currChar == "\r") {
							currChar = "\n"
						}
						buffer.push(currChar);
					}
	
				} while (true);

				parser.document.guillemotBuffer.push(buffer.join(""));

				// Riavvio il processo
				parser.currentState = parser.stateGuillemotIndentation;
				parser.streamProcess (parser.stackStreams.top);				
				
			}
			catch (ex) {
				throw new Error(ex.message);
			}
		}) //
		.catch( err => {
			throw new Error(err);
		});

	}

    nextSymbol (b) {

        switch (b) {
            case "\r":
			case "\n":
				this.parser.changeState(this.parser.stateGuillemotIndentation, b);
				// Abbandono temporaneamente la scansione del precedente file
				return true;
				//break;
            default:
                this._buffer.push(b);
		}

	}

    reset () {
        this._buffer = [];
	}

}
