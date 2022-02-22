// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanStream} from "./HoomanStream.js";
import {HoomanParser} from "./HoomanParser.js";

export class HoomanService {

	constructor(embodiment) {
		
        this.embodiment = embodiment;

	}
	
    parseFile (coords) {

		var service = this;
		let prom = new Promise(function(resolve, reject) {

			try {

				service.embodiment.getContents(coords) //
				.then( data => {
					
					let s = new HoomanStream(data);
					let ps = new HoomanParser(service.embodiment);
					ps.resolve = resolve;
					ps.reject = reject;
					ps.startProcess("", s);

				}) //
				.catch( err => {
					reject({message: err.message, document: "", line: 0, code: 55});
				});

			}
			catch (ex) {
				reject({message: ex.message, document: "", line: 0, code: 27});
			}

		});

		return prom;
	}

    parse(hooDocument) {

		var service = this;
		let prom = new Promise(function(resolve, reject) {

			try {

				let s = new HoomanStream(hooDocument);
				let ps = new HoomanParser(service.embodiment);
				ps.resolve = resolve;
				ps.reject = reject;
				ps.startProcess("", s);

			}
			catch (ex) {
				reject({message: ex.message, document: "", line: 0, code: 28});
			}

		});

		return prom;

    }

    exportStructureJSON(compound) {

        let p = compound.getLimb("hooman").getLimb("syntax").getLimb("structure");

        let expJSON = new HoomanExportStructure2JSON(p);

        return expJSON.export();

    }
	
}
