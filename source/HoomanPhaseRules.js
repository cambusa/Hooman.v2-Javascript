// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanPhase} from "./HoomanPhase.js";
import {HoomanRule} from "./HoomanRule.js";
import {HoomanRuleContext} from "./HoomanRuleContext.js";
import {HoomanRuleClause} from "./HoomanRuleClause.js";

export class HoomanPhaseRules extends HoomanPhase {
	
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

					this.parser.thenOccurred = false;
					this.parser.currentRule = new HoomanRule(limb.name);
					this.parser.rules.add(this.parser.currentRule);

				}
				else if (this.docIndentation > 4) {

					// Tested [TestWrongIndentation4]
					let doc = this.parser.document.namex;
					let line = this.parser.document.row;
					let code = 13;
					let message = "{0}Wrong indentation at row {1}".format(doc, line);
					this.parser.reject({message: message, document: doc, line: line, code: code});
					throw new Error(message);
		
				}

		}

        return false;

	}

    valueManagement (value) {

		if (this.stackDocuments.top.indentation >= 4) {

			if (this.parser.thenOccurred) {

				var objTop = this.stackLimbs.top;

				if (objTop.tag == "js") {

					this.rules.functProgr++;
					
					let functName = "__" + objTop.name + "_" + this.rules.functProgr;

					this.rules.scriptJS.push("function ");
					this.rules.scriptJS.push(functName);
					this.rules.scriptJS.push("(){");
					this.rules.scriptJS.push("\n");
					this.rules.scriptJS.push("    return ");
					this.rules.scriptJS.push(value);
					this.rules.scriptJS.push(";");
					this.rules.scriptJS.push("\n");
					this.rules.scriptJS.push("}");
					this.rules.scriptJS.push("\n");

					value = functName;
					
				}

				this.parser.currentRule.addClause(new HoomanRuleClause(objTop.name, value, objTop.tag.toLowerCase()));
			
			}
			else {

				this.parser.currentRule.addContext(new HoomanRuleContext(this.stackLimbs.top.name, value));

			}

		}

	}

}
