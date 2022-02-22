// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanRuleClause {
	
    name;
    pattern;
    tag;

    constructor (n, p, t) {

        this.name = n;
        this.pattern = p;
        this.tag = t;

	}

}
