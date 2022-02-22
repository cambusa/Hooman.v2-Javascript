// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanStackInfos {
	
    _parser;
    _backup;
	_stack;
	_topIndex;
	_topIndexBackup;
	_top;
    _baseRecursionIndex;
    _baseRecursionName;
    _recursionCount;
    _recursionIsActive;

	constructor (parser) {
		
        this._parser = parser;
        this._stack = [];
        this._backup = [];
        this._topIndex = -1;
        this._topIndexBackup = -1;
        this._top = null;
        this._baseRecursionIndex = 0;
        this._baseRecursionName = "";
        this._recursionCount = 0;
        this._recursionIsActive = false;

	}

    push (elem) {

        if (elem.isRecursive && this._recursionCount == 0) {

            this._topIndex++;
            this._stack[this._topIndex] = elem;
            this._top = elem;

            this._baseRecursionIndex = this._topIndex;
            this._recursionCount = 1;
            this._baseRecursionName = elem.name.toLowerCase();

        }
        else if (elem.name.toLowerCase() == this._baseRecursionName) {

            this._recursionCount++;

            do {
                this._stack.pop();
                this._topIndex--;
            } while (this._topIndex != this._baseRecursionIndex);

            let x = this._stack[ this._baseRecursionIndex ]; 

            elem.hasDefault = x.hasDefault;
            elem.hasWildcard = x.hasWildcard;
            elem.isRecursive = x.isRecursive;

            this._top = this._stack[ this._topIndex ];
        }
        else {

            this._topIndex++;
            this._stack[ this._topIndex ] = elem;
            this._top = elem;

            if (this._recursionCount == 1) {

                this._topIndexBackup++;
                this._backup[ this._topIndexBackup ] = elem;

            }

        }

    }

    pop () {

        if (this._top.isRecursive) {

            this._recursionCount--;

            if (this._recursionCount < 0) {

                // Siamo nella fase di analisi sintattica

                this._stack.pop();
                this._topIndex--;
                this._top = this._stack[ this._topIndex ];

                this._recursionCount = 0;
                this._recursionIsActive = false;
            
            }
            else if (this._recursionCount == 0) {

                this._stack.pop();
                this._topIndex--;
                this._top = this._stack[ this._topIndex ];

                // Spengo il meccanismo di ricorsione
                while (this._topIndexBackup != -1) {
                    this._backup.pop();
                    this._topIndexBackup--;
                }

                this._baseRecursionIndex = -1;
                this._baseRecursionName = "";
                this._recursionCount = 0;
                this._recursionIsActive = false;
            }
            else {

                for (let i = 0; i <= this._topIndexBackup; i++) {

                    this._topIndex++;
                    this._stack[ this._topIndex ] = this._backup[i];
                    this._top = this._backup[i];

                }

            }
        }
        else if (this._top.name.toLowerCase() == this._baseRecursionName) {

            throw new Error("Internal error");
        
        }
        else {

            this._stack.pop();
            this._topIndex--;
            this._top = this._stack[ this._topIndex ];

            if (this._recursionCount == 1) {

                this._backup.pop();
                this._topIndexBackup--;

            }

        }

    }

    reset () {

        this._stack = [];
        this._backup = [];
        this._topIndex = -1;
        this._topIndexBackup = -1;
        this._top = null;
        this._baseRecursionIndex = -1;
        this._baseRecursionName = "";
        this._recursionCount = 0;
        this._recursionIsActive = false;

    }

    get topIndex () {

        if (this._recursionCount == 0) {
            return this._topIndex;
        }
        else {
            return (this._recursionCount - 1) * (this._backup.length + 1) + this._topIndex;
        }

    }

    get top () {
       return this._top;
    }

    get topParent () {

        return this._stack[ this._topIndex - 1 ];

    }

    valueManagement (value) {

        if (value == "*") {

            if (this.topParent.infos.count() > 1) {

                // Tested [TestWildcardSiblings2]
                let doc = this._parser.document.namex;
                let line = this._parser.document.row;
                let code = 29;
                let message = "{0}A wildcard variable cannot have siblings at row {1}".format(doc, line);
                this._parser.reject({message: message, document: doc, line: line, code: code});
                throw new Error(message);
                
            }

            this._top.isWildcard = true;
            this.topParent.hasWildcard = true;
        
        }
        else if (value == "...") {

            if (this._recursionIsActive) {

                // Tested [TestMultipleRecursions]
                let doc = this._parser.document.namex;
                let line = this._parser.document.row;
                let code = 30;
                let message = "{0}Multiple recursions cannot be nested at the same time at row {1}".format(doc, line);
                this._parser.reject({message: message, document: doc, line: line, code: code});
                throw new Error(message);
    
            }

            this._recursionIsActive = true;
            this._top.isRecursive = true;

        }
        else if (value == "!") {

            this._top.isMandatory = true;
            this.topParent.hasMandatory = true;

        }
        else if (value != "") {

            this._top.isDefault = true;
            this._top.defaultValue = value;
            this.topParent.hasDefault = true;

        }

    }

}
