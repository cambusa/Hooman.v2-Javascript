// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanStatics {
	
	static typeSimple = 0;
	static typeComplex = 1;
	static _flagInit = false;

	static initSystem () {

		if (!this._flagInit) {

			this._flagInit = true;

			String.prototype.format = function() {
				var a = this;
				for (let k in arguments) {
					a = a.replace("{" + k + "}", arguments[k]);
				}
				return a;
			}	

		}
	}
	
}

HoomanStatics.initSystem();
