// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanExportStructure2JSON {
	
	_root;

	constructor(limb) {
		this._root = limb.getLimb("hooman").getLimb("syntax").getLimb("structure");
	}

    export () {

        try {

            var build = [];

            build.push("{");
            this._recursiveWalk(build, this._root, 1);
            build.push("}");

            return build.join("");
		
		}
        catch (ex) {

            throw new Error(ex.Message);

		}

	}

    _recursiveWalk(build, limb, level) {

        build.push("\"_nodeInfo\":{");

		build.push("\"iswildcard\":");
        build.push((limb.isWildcard ? "1" : "0"));
        build.push(",");

        build.push("\"haswildcard\":");
        build.push((limb.hasWildcard ? "1" : "0"));
        build.push(",");

        build.push("\"isrecursive\":");
        build.push((limb.isRecursive ? "1" : "0"));

        build.push("}");

        for (let l of limb.complexValue) {

			build.push(",");

			build.push("\"");

			if (/^\d/.test(l.name)) {
				build.push("i");
			}

            build.push(l.name.toLowerCase());

            build.push("\"");
            build.push(":");

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

				build.push("{");
                this._recursiveWalk(build, l, level + 1);
                build.push("}");

            }

		}

	}

}
