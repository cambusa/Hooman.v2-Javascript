// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanPhase} from "./HoomanPhase.js";

export class HoomanPhaseHooman extends HoomanPhase {
	
	constructor(parser) {
		super(parser);
	}

    stackManagement (limb) {

		switch (this.docIndentation) {

		case 0:

			if (limb.name.toLowerCase() != "hooman") {

				this.parser.currentPhase = this.parser.phaseBeginData;

				this.parser.currentPhase.stackManagement(limb);

			}

			break;

		case 1:

			switch (limb.name.toLowerCase()) {

			case "syntax":

				this.parser.currentPhase = this.parser.phaseSyntax;
				break;

			case "locked":

				this.stackDocuments.top.locked = true;
				this.parser.includedDocuments[this.stackDocuments.top.docRef].locked = true;

			}

		}

        return false;

	}

    valueManagement (value) {

		if (this.stackDocuments.top.indentation == 1) {

			switch (this.stackLimbs.top.name.toLowerCase()) {

			case "version":

				if (/^\d+$/.test(value)) {

					if (this.stackDocuments.topIndex == 1) {
						this.parser.compound.version = parseInt(value).toString();
					}

				}
				else {
				
					// Tested [TestBadVersion]
					let doc = this.parser.document.namex;
					let line = this.parser.document.row;
					let code = 9;
					let message = "{0}Version must be an integer at row {1}".format(doc, line);
					this.parser.reject({message: message, document: doc, line: line, code: code});
					throw new Error(message);
					
				}

				break;

			case "classifier":

				if ((/^[A-Z_0-9]+$/i).test(value)) {

					if (this.stackDocuments.topIndex == 1) {
						this.parser.compound.classifier = value.toLowerCase();
					}
					else {
						this.parser.compound.inclusions.push(value.toLowerCase());
					}

				}
				else {

					// Tested [TestInvalidClassifier]
					let doc = this.parser.document.namex;
					let line = this.parser.document.row;
					let code = 10;
					let message = "{0}Invalid classifier at row {1}".format(doc, line);
					this.parser.reject({message: message, document: doc, line: line, code: code});
					throw new Error(message);
		
				}

				break;
			
			}
		}
	}
}
