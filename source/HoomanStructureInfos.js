// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanStructureInfos {

    _parser;
    _collItem;

	constructor(parser) {
		
		this._parser = parser;
		this._collItem = new Map();

	}

    exists (name) {
        return this._collItem.has(name);
    }

    getInfo (name) {

        name = name.toLowerCase();

        if (this._collItem.has(name)) {

            return this._collItem.get(name.toLowerCase());

		}
        else {

            // Tested [TestNotAllowed]
			let doc = this._parser.includedDocuments[ this._parser.document.docRef ].tagName;
			let line = this._parser.document.row;
			let code = 54;
            let message = "{0}Variable [ {1} ] is not allowed at row {2}".format(doc, name, line);
            this._parser.reject({message: message, document: doc, line: line, code: code});
            throw new Error(message);

		}

	}

    count () {
        return this._collItem.size;
	}

    add (item) {

        var name = item.name.toLowerCase();
        this._collItem.set(name, item);

	}

    clear () {
        this.collItem.clear();
	}

    remove (item) {
        return this._collItem.remove(item.name);
	}

    get first() {

        if (this._collItem.size > 0) {
            return this._collItem.values().next().value;
        }
        else {
            return null;
        }

    }

	[Symbol.iterator] = function * () {
        for (let pair of this._collItem) {
            yield pair[1]; 
        }       
    }


 }
