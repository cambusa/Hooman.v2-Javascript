// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanPhase} from "./HoomanPhase.js";
import {HoomanStructureInfo} from "./HoomanStructureInfo.js";

export class HoomanPhaseStructure extends HoomanPhase {
	
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

			if (this.docIndentation - 3 < this.parser.stackInfos.topIndex) {

				do {
					this.parser.stackInfos.pop();
				} while (this.docIndentation - 3 != this.parser.stackInfos.topIndex);

			}

			if (this.parser.stackInfos.top.hasWildcard) {

				// Tested [TestWildcardSiblings]
				let doc = this.stackDocuments.top.namex;
				let line = this.stackDocuments.top.row;
				let code = 14;
				let message = "{0}A wildcard variable cannot have siblings at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
				
			}

			let s = new HoomanStructureInfo(this.parser, limb.name);

			this.parser.stackInfos.top.infos.add(s);
			this.parser.stackInfos.push(s);

		}

        return false;

	}

    valueManagement (value) {

        this.parser.stackInfos.valueManagement(value);

		if (this.parser.stackInfos.top.isWildcard) {
			this.parser.stackLimbs.top.isWildcard = true;
		}

		if (this.parser.stackInfos.topParent.hasWildcard) {
			this.parser.stackLimbs.top.parent.hasWildcard = true;
		}

		if (this.parser.stackInfos.top.isRecursive) {
			this.parser.stackLimbs.top.isRecursive = true;
		}

	}

}
