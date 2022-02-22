// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanPhase} from "./HoomanPhase.js";

export class HoomanPhaseModules extends HoomanPhase {
	
	constructor(parser) {
		super(parser);
	}

    stackManagement (limb) {

		var caseElse = false;

		switch (this.docIndentation) {

		case 0:

			switch (limb.name.toLowerCase()) {

			case "hooman":

				this.parser.currentPhase = this.parser.phaseHooman;
				break;

			default:

				this.parser.currentPhase = this.parser.phaseBeginData;
				this.parser.currentPhase.stackManagement(limb);

			}

			break;

		case 1:

			switch (limb.name.toLowerCase()) {

			case "syntax":

				this.parser.currentPhase = this.parser.phaseSyntax;
				break;

			default:

				this.parser.currentPhase = this.parser.phaseHooman;

			}

			break;

		case 2:

			switch (limb.name.toLowerCase()) {

			case "structure":

				this.parser.currentPhase = this.parser.phaseStructure;
				break;

			case "rules":

				this.parser.currentPhase = this.parser.phaseRules;
				break;

			case "modules":

				this.parser.currentPhase = this.parser.phaseModules;
				break;

			case "library":

				this.parser.currentPhase = this.parser.phaseLibrary;
				break;

			}

			break;

		default:

			if (this.docIndentation == 3) {

				this.parser.modules.push(limb.name.toLowerCase());
			
			}
			else {

				// Tested [TestWrongIndentation3]
				let doc = this.parser.document.namex;
				let line = this.parser.document.row;
				let code = 12;
				let message = "{0}Wrong indentation at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
	
			}

		}

        return false;

	}

}
