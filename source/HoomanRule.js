// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanRule {

    name;
    _collContext;
    _collClause;

    constructor (name) {

        this.name = name;
		this._collContext = new Set();
		this._collClause = new Set();

	}

    get contexts () {
        return this._collContext;
	}

    get clauses () {
        return this._collClause;
	}

    addContext (x) {
        this._collContext.add(x);
	}

	addClause (x) {
		this._collClause.add(x);
	}

    clear () {

        this._collContext.clear();
        this._collClause.clear();

	}

}
