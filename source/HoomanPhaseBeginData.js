// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanPhase} from "./HoomanPhase.js";

export class HoomanPhaseBeginData extends HoomanPhase {
	
	constructor(parser) {
		super(parser);
	}

    stackManagement (limb) {

		this.parser.stackInfos.reset();
		this.parser.stackInfos.push(this.parser.structureInfo);

		this.rules.hasSyntaxStructure = (this.parser.structureInfo.infos.count() > 0);
		this.rules.hasSyntaxRules = (this.parser.rules.count() > 0);

		if (this.parser.compound.version < 2) {
			// mosca: accetto il rischio di costrutti non supportati
			// Throw New Exception("Document version not supported")
		}

		this.parser.currentPhase = this.parser.phaseData;

		if (limb !== null) {

			let t = this.stackDocuments.top;
			this.parser.currentPhase.docRef = t.docRef;
			this.parser.currentPhase.docRow = t.row;

			this.parser.currentPhase.stackManagement(limb);
		}
		
        return false;

	}

}
