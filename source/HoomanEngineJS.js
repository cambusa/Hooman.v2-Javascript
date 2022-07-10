// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanEngineJS {

	_codebase;

	constructor (codebase) {
		this._codebase = codebase + "\n";
	}

    execute (code){
		this._codebase += code + ";\n";
	}
	
	invoke (formula) {
		let F = new Function(this._codebase + "return " + formula + "();");
		return F();
	}
}
