// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanStatics} from "./HoomanStatics.js";

export class HoomanExport2JSON {
	
	_root;
    _detectArray;

	constructor(limb, detectArray = true) {
		this._root = limb;
        this._detectArray = detectArray;
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

		let isArray = false;

        if (this._detectArray) {
            let progr = 1;
            isArray = true;
            for (let l of limb.complexValue) {
                if (l.name != progr) {
                    isArray = false;
                    break;
                }
                progr++;
            }
        }

        var flagComma = false;

        if (isArray) {
            build.push("[");
        }
        else {
            build.push("{");
        }

        for (let l of limb.complexValue) {

            if (level > 1 || l.name.toLowerCase() != "hooman") {

                if (flagComma) {
					build.push(",");
				}

                if (!isArray) {

                    build.push("\"");

                    if (/^\d/.test(l.name)) {
                        build.push("i");
                    }

                    build.push(l.name.toLowerCase());

                    build.push("\"");
                    build.push(":");

                }

                if (l.valueType == HoomanStatics.typeSimple) {

                    let oVl = l.actualValue;
                    let sVl;
                    let flagQuote = true;

                    if (oVl.constructor.name == "String") {

						sVl = oVl //
						.replace(/\\/g, "\\\\") //
						.replace(/\r/g, "\\r") //
						.replace(/\n/g, "\\n") //
						.replace(/\t/g, "\\t") //
						.replace(/\"/g, "\\\"");

					}
					else if (oVl.constructor.name == "Date") {

						sVl =  (oVl.getFullYear() + "-" +
                            ("0"+(oVl.getMonth()+1)).slice(-2) + "-" +
                            ("0" + oVl.getDate()).slice(-2) + "T" + 
                            ("0" + oVl.getHours()).slice(-2) + ":" + 
                            ("0" + oVl.getMinutes()).slice(-2) + ":" +
                            ("0" + oVl.getSeconds()).slice(-2)) //
                            .replace("T00:00:00", "");

					}
                    else {

						sVl = oVl.toString();
						flagQuote = false;

					}

                    if (flagQuote) {
						build.push("\"");
					}

                    build.push(sVl);

                    if (flagQuote) {
						build.push("\"");
					}

				}
                else {

                    this._recursiveWalk(build, l, level + 1);

				}

                flagComma = true;

			}

		}

        if (isArray) {
            build.push("]");
        }
        else {
            build.push("}");
        }

	}

}
