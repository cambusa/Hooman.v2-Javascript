// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanDocumentInfo} from "./HoomanDocumentInfo.js";

export class HoomanStackDocuments {
	
	constructor(parser) {
		
		this.parser = parser;
        this.stack = [];
        this.topIndex = -1;
        this.top = null;
        this.docRef = 0;
		
	}

    push (elem) {

        this.topIndex++;
        this.stack[this.topIndex] = elem;
        this.top = elem;

        this.docRef++;
        this.parser.includedDocuments[this.docRef] = new HoomanDocumentInfo(elem.name);
        elem.docRef = this.docRef;

    }

    pop () {

        this.stack.pop();
        this.topIndex--;
        this.top = this.stack[this.topIndex];

    }

    reset () {

        this.stack = [];
        this.topIndex = -1;
        this.top = null;
        this.docRef = 0;
        this.parser.includedDocuments = [];

    }

}
