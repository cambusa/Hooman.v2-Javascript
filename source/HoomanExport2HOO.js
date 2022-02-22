// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanStatics} from "./HoomanStatics.js";

export class HoomanExport2HOO {
	
	_root;

	constructor(limb) {
		this._root = limb;
	}

    export () {

        try {

            var build = [];
            this._recursiveWalk(build, this._root, 0);
            return build.join("");
		
		}
        catch (ex) {

            throw new Error(ex.message);

		}

	}

    _recursiveWalk(build, limb, level) {

        for (let l of limb.complexValue) {

            if (level > 0 || l.name.toLowerCase() != "hooman") {

                if(level > 0){
                    build.push("\t".repeat(level));
                }

                build.push(l.name);

                if (l.valueType == HoomanStatics.typeSimple) {

                    let oVl = l.actualValue;
                    let sVl;

                    if (oVl.constructor.name == "String") {

						sVl = oVl;

					}
					else if (oVl.constructor.name == "Date") {

						sVl =  ("0" + oVl.getDate()).slice(-2) + "-" + 
						       ("0"+(oVl.getMonth()+1)).slice(-2) + "-" +
						       oVl.getFullYear() + "T" + 
							   ("0" + oVl.getHours()).slice(-2) + ":" + 
							   ("0" + oVl.getMinutes()).slice(-2) + ":" +
							   ("0" + oVl.getSeconds()).slice(-2) //
							   .replace("T00:00:00", "");

					}
                    else {

						sVl = oVl.toString();

					}

                    if(sVl.indexOf("\n") >= 0){
                        let matchRows = sVl.split("\n");
                        build.push("\n");
                        build.push("\t".repeat(level + 1));
                        build.push("<<");
                        build.push(l.tag);
                        build.push("\n");
                        for (let matchRow of matchRows) {
                            build.push("\t".repeat(level + 2));
                            build.push(matchRow);
                            build.push("\n");
                        }
                        build.push("\t".repeat(level + 1));
                        build.push(">>\n");
                    }
                    else{
                        build.push(" ");
                        build.push(sVl);
                        build.push("\n");
                    }

				}
                else {

                    build.push("\n");

                    this._recursiveWalk(build, l, level + 1);

				}

			}

		}

	}

}
