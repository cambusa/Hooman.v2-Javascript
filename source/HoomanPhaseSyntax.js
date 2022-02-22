// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanPhase} from "./HoomanPhase.js";

export class HoomanPhaseSyntax extends HoomanPhase {
	
	constructor(parser) {
		super(parser);
	}

    stackManagement (limb) {

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

			switch (limb.name.toLowerCase) {

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

		}

        return false;

	}

    valueManagement (value) {

		switch (this.stackLimbs.top.name.toLowerCase()) {

		case "syntax":

			if (value == "!") {
				if (this.stackDocuments.topIndex == 1) {
					this.parser.compound.isSyntactic = true;
				}
			}
			break;

		}
	}
}
