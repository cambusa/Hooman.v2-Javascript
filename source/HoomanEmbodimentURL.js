// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanEmbodimentURL {
	
    baseURL;

	constructor(baseURL = "") {

        if (baseURL!= "" && !baseURL.endsWith("/")) {
            baseURL += "/";
        }

        this.baseURL = baseURL;
	}
	
    getContents (coords) {

        if (coords.indexOf("//") == -1 && coords.indexOf(":") == -1) {
            coords = this.baseURL + coords;
        }

        let prom = new Promise(function(resolve, reject) {

			try {

                fetch(coords) //
                .then( response => {

                    if (response.ok) {

                        return response.text();

                    }
                    else {

                        let message = "File [ {0} ] not available".format(coords);
                        reject({message: message});
                        return false;
            
                    }

                }) //
                .then( data => {
                    if (data !== false) {
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
                }) //
                .catch ( err => {
                    reject({message: err.message});
                });

			}
			catch (ex) {
				reject({message: ex.message});
			}

		});

		return prom;

    }
}
