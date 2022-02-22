// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";
import {HoomanDocument} from "./HoomanDocument.js";
import {HoomanStream} from "./HoomanStream.js";

export class HoomanStateIncludeSub extends HoomanState {
	
	_buffer;

	constructor(parser) {
		super(parser);
	}


    get buffer () {
        return this._buffer.join("").trim();
	}

	get name () {
		return "IncludeSub";
	}

    complete () {

        var name = this.buffer;
		var parser = this.parser;

		this.parser.embodiment.getContents(name) //
		.then( data => {

			try {

				let streamIn = new HoomanStream(data);

				parser.currentState = parser.stateInitial;
				parser.stackDocuments.push(new HoomanDocument(parser, name, parser.stackDocuments.top.indentation));
				parser.stackStreams.push(streamIn);
				parser.streamProcess(streamIn);
				
			}
			catch (ex) {
				let doc = parser.document.namex;
				let line = parser.document.row;
				let code = 56;
				let message = ex.message;
				this.parser.reject({message: message, document: doc, line: line, code: code});
				//throw new Error(message);
			}
		}) //
		.catch( err => {
			let doc = parser.document.namex;
			let line = parser.document.row;
			let code = 57;
			let message = err.message;
			this.parser.reject({message: message, document: doc, line: line, code: code});
			//throw new Error(message);
		});

	}

    nextSymbol (b) {

        switch (b) {
            case "\r":
			case "\n":
				this.parser.changeState(this.parser.stateIndentation, b);
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
