// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanLimb} from "./HoomanLimb.js";
import {HoomanStatics} from "./HoomanStatics.js";

export class HoomanPhase {
	
    docIndentation;
    docRef;
    docRow;

	constructor(parser) {

		this.parser = parser;
		this.stackDocuments = parser.stackDocuments;
		this.stackLimbs = parser.stackLimbs;
		this.rules = parser.rules;

	}
	
    bodyBuilder(name){

		let t = this.stackDocuments.top;

		this.docIndentation = t.indentation;
		this.docRef = t.docRef;
		this.docRow = t.row;

        if (this.docIndentation < this.stackLimbs.topIndex) {

            do {
                this.stackLimbs.pop();
            } while (this.docIndentation != this.stackLimbs.topIndex);

        }

        if (name == "+") {

            let lastLimbName = this.stackLimbs.top.lastLimb.name;
			
            if (/^\d+$/.test(lastLimbName)) {
                name = (parseInt(lastLimbName) + 1).toString();
			}
            else {
                // Tested [TestPlusNotResolved]
                let doc = this.stackDocuments.top.namex;
                let line = this.stackDocuments.top.row;
                let code = 7;
                let message = "{0}Plus operator cannot be resolved at row {1}".format(doc, line);
                this.parser.reject({message: message, document: doc, line: line, code: code});
                throw new Error(message);
               }

        }

        var l;

        if (this.stackLimbs.top.objectType == "HoomanLimb") {

            var lParent = this.stackLimbs.top;
            l = new HoomanLimb(name, lParent, "", this.docRef, this.docRow);

            if (lParent.objectType == "HoomanLimb") {
                lParent.valueType = HoomanStatics.typeComplex;
            }

            l = lParent.complexValue.setLimb(l);

		}
        else {

            let cParent = this.stackLimbs.top;
            l = new HoomanLimb(name, cParent, "", this.docRef, this.docRow);

            l = cParent.complexValue.setLimb(l);

        }

        this.stackLimbs.push(l);

        return l;
    }

    stackManagement(limb) {

        return false;

	}

    valueManagement(value) {
	
	}
}
