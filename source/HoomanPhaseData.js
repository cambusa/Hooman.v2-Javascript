// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanPhase} from "./HoomanPhase.js";
import {HoomanStatics} from "./HoomanStatics.js";
import {HoomanLimb} from "./HoomanLimb.js";

export class HoomanPhaseData extends HoomanPhase {
	
	constructor(parser) {
		super(parser);
	}

    stackManagement (limb) {

		if (this.parser.compound.isSyntactic) {
			// Tested [TestSyntaxDocumentWithData]
			let doc = this.parser.document.namex;
			let line = this.parser.document.row;
			let code = 28;
			let message = "{0}Syntactic document should not contain any data at row {1}".format(doc, line);
			this.parser.reject({message: message, document: doc, line: line, code: code});
			throw new Error(message);
		}

		if (this.docIndentation == 0) {
			if (limb.name.toLowerCase() == "hooman") {
				// Tested [TestHoomanAfterData]
				let doc = this.parser.document.namex;
				let line = this.parser.document.row;
				let code = 8;
				let message = "{0}The hooman branch cannot be changed after data entry at row {1}".format(doc, line);
				this.parser.reject({message: message, document: doc, line: line, code: code});
				throw new Error(message);
			}
		}

		// Essendoci anche dati nel documento, effettuo
		// un controllo di sicurezza per cui o la sintassi è tutta nel documento
		// principale o è tutta inclusa

		if (this.parser.compound.syntaxMain && this.parser.compound.syntaxIncluded) {

			// Tested [TestSafeSyntax2]
			let doc = "";
			let line = 0;
			let code = 5;
			let message = "A syntactic section already exists in an included document";
			this.parser.reject({message: message, document: doc, line: line, code: code});
			throw new Error(message);

		}

		if (this.rules.hasSyntaxStructure) {

			var s;

			if (this.docIndentation < this.parser.stackInfos.topIndex) {

				do {
					this.parser.stackInfos.pop();
				} while (this.docIndentation != this.parser.stackInfos.topIndex);

			}

			if (this.parser.stackInfos.top.hasWildcard) {
				s = this.parser.stackInfos.top.infos.first;
			}
			else {
				s = this.parser.stackInfos.top.infos.getInfo(limb.name);
			}

			//----------------------------
			// Gestione valori di default
			//----------------------------

			if (s.hasDefault) {

				for (let f of s.infos) {

					if (f.isDefault) {

						if (limb.objectType == "HoomanLimb") {
							limb.valueType = HoomanStatics.typeComplex;
						}

						limb.complexValue.setLimb(new HoomanLimb(f.name, limb, f.defaultValue, this.docRef, this.docRow));

					}

				}

			}

			//--------------------------------------
			// Gestione valori dichiarati complessi
			//--------------------------------------

			if (s.infos.count() > 0) {
				if (limb.valueType == HoomanStatics.typeSimple) {
					limb.valueType = HoomanStatics.typeComplex;
				}
			}

			this.parser.stackInfos.push(s);

		}

        return false;

	}

}
