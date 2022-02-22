// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanState} from "./HoomanState.js";

export class HoomanStateAssignment extends HoomanState {
	
	constructor(parser) {
		super(parser);
	}

    get name () {
		return "Assignment";
	}

    nextSymbol (b) {

		if (b == "\r" || b == "\n") {

			// In attesa di un valore stringa da assegnare a una variabile
			// è stato incontrato un accapo: la variabile o ha valore blank
			// oppure è una variabile complessa

			this.parser.changeState(this.parser.stateIndentation, b);

		}
        else if (b == " " || b == "\t") {
		}
        else{
			
			// Inizia il valore stringa da assegnare alla variabile corrente
			this.parser.changeState(this.parser.stateValue, b);

		}

	}

}
