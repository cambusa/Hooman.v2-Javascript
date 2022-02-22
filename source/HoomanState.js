// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanState {

    parser;

    stateAssignment;
    stateBOM;
    stateFinal;
    stateGuillemotBegin;
    stateGuillemotBody;
    stateGuillemotEnd;
    stateGuillemotIndentation;
    stateIncludeSub;
    stateIncludeText;
    stateIndentation;
    stateInitial;
    stateLessThan;
    stateRemark;
    stateValue;
    stateVariable;
    statePlus;
    stateThen;
	
	constructor(parser) {

		this.parser = parser;

	}
	
	initialize(){

	}

    get buffer () {
        return "";
	}

    get name () {
		return "";
	}

    complete () {

	}

    finalCheck () {

	}

    nextSymbol (b) {

	}

    reset () {

	}
	
}
