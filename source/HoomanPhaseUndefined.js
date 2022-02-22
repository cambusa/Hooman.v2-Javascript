// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanPhase} from "./HoomanPhase.js";

export class HoomanPhaseUndefined extends HoomanPhase {
	
	constructor(parser) {
		super(parser);
	}

    stackManagement (limb) {

		switch (limb.name.toLowerCase()) {

		case "hooman":

			this.parser.currentPhase = this.parser.phaseHooman;
			break;

		default:

			this.parser.currentPhase = this.parser.phaseBeginData;
			this.parser.currentPhase.stackManagement(limb);

		}

        return false;

	}

}
