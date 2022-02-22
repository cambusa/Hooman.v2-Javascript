// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanDocument {
	
    _indentation;

    constructor (parser, name, offset) {
		
        this.parser = parser;

        this.name = name;
        this.spacesForTab = 4;
        this.offset = offset;
        this._indentation = 0;
        this.row = 1;
        this.newLine = false;
        this.newLineCharacter = "\n";
        this.isSpacesForTabSettled = false;
        this.isNewLineCharacterSettled = false;
        this.guillemotBuffer = [];
        this.guillemotSession = false;
        this.guillemotSkipNewLine = false;

        this.notInitialized = true;
        this.countSpaces = -1;

        this.docRef = 0;
        this.locked = false;

    }

    get namex () {
        if (this.name != "") {
            return "[ " + this.name + " ] ";
        }
        else {
            return "";
        }
    }

    get indentation () {
        return this.offset + this._indentation;
    }

    set indentation (value) {
    
        if (value > this._indentation + 1) {
            // Tested [TestWrongIndentation]
            let doc = this.parser.document.namex;
            let line = this.parser.document.row;
            let code = 1;
            let message = "{0}Wrong indentation at row {1}".format(doc, line);
            this.parser.reject({message: message, document: doc, line: line, code: code});
            throw new Error(message);
        }

        this._indentation = value;

    }

    inputManagement (currChar) {

        if (this.notInitialized) {

            if (!this.isNewLineCharacterSettled) {

                if (currChar == "\n") {

                    this.newLineCharacter = "\n";
                    this.isNewLineCharacterSettled = true;
                
                }
                else if (currChar == "\r") {

                    this.newLineCharacter = "\r";
                    this.isNewLineCharacterSettled = true;

                }

            }

            if (!this.isSpacesForTabSettled) {

                if (currChar == this.newLineCharacter) {

                    this.countSpaces = 0;

                }
                else if (currChar == " " && this.countSpaces >= 0) {

                    this.countSpaces++;
                
                }
                else if (currChar == "\t") {

                    this.spacesForTab = 4;
                    this.isSpacesForTabSettled = true;
                
                }
                else {

                    if (this.countSpaces > 0) {

                        this.spacesForTab = this.countSpaces;
                        this.isSpacesForTabSettled = true;

                    }

                    this.countSpaces = -1;

                }

            }

            if (this.isNewLineCharacterSettled && this.isSpacesForTabSettled) {

                this.notInitialized = false;

            }

        }

        if (currChar == this.newLineCharacter) {

            // Gestione prossima riga
            this.newLine = true;

        }

        if ((currChar == "\r" && this.newLineCharacter != "\r") || (currChar == "\n" && this.newLineCharacter != "\n")) {
            return false;
        }
        else {
            return true;
        }

    }

}
