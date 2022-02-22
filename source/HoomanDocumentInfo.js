// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanDocumentInfo {
	
    name;
    tagName;
    locked;

    constructor(name) {
		
        this.name = name;

        if (name == "") {
            this.tagName = "";
        }
        else {
            this.tagName = "[ " + name + " ] ";
        }

        this.locked = false;

	}

}
