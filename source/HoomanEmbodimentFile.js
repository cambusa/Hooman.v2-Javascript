// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

// Righe da porre in testa al modulo Hoomanode.mjs
//import { createRequire } from 'module';
//const require = createRequire(import.meta.url);

export class HoomanEmbodimentFile {
	
    baseDir;

	constructor(baseDir = "") {

        if (baseDir != "" && !baseDir.endsWith("/")) {
            baseDir += "/";
        }

        this.baseDir = baseDir;
	}
	
    getContents (coords) {

        if (coords.indexOf("//") == -1 && coords.indexOf(":") == -1) {
            coords = this.baseDir + coords;
        }

        let prom = new Promise(function(resolve, reject) {

			try {

                var fs = require('fs');
                var data = fs.readFileSync(coords, { encoding: "utf8" });

                if (!data.endsWith("\n") && !data.endsWith("\r")) {
                    if (data.indexOf("\r\n")) {
                        data += "\r\n";
                    }
                    else if (data.indexOf("\r")) {
                        data += "\r";
                    }
                    else {
                        data += "\n";
                    }
                }

                resolve(data);
        
			}
			catch (ex) {
				reject({message: ex.message});
			}

		});

		return prom;

    }
}
