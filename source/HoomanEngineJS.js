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
		return eval(this._codebase + formula + "();");
	}
}
