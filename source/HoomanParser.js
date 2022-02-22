// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanCompound} from "./HoomanCompound.js";
import {HoomanStateAssignment} from "./HoomanStateAssignment.js";
import {HoomanStateBOM} from "./HoomanStateBOM.js";
import {HoomanStateFinal} from "./HoomanStateFinal.js";
import {HoomanStateGuillemotBegin} from "./HoomanStateGuillemotBegin.js";
import {HoomanStateGuillemotBody} from "./HoomanStateGuillemotBody.js";
import {HoomanStateGuillemotEnd} from "./HoomanStateGuillemotEnd.js";
import {HoomanStateGuillemotIndentation} from "./HoomanStateGuillemotIndentation.js";
import {HoomanStateIncludeSub} from "./HoomanStateIncludeSub.js";
import {HoomanStateIncludeText} from "./HoomanStateIncludeText.js";
import {HoomanStateIndentation} from "./HoomanStateIndentation.js";
import {HoomanStateInitial} from "./HoomanStateInitial.js";
import {HoomanStateLessThan} from "./HoomanStateLessThan.js";
import {HoomanStatePlus} from "./HoomanStatePlus.js";
import {HoomanStateRemark} from "./HoomanStateRemark.js";
import {HoomanStateThen} from "./HoomanStateThen.js";
import {HoomanStateValue} from "./HoomanStateValue.js";
import {HoomanStateVariable} from "./HoomanStateVariable.js";

import {HoomanPhaseBeginData} from "./HoomanPhaseBeginData.js";
import {HoomanPhaseData} from "./HoomanPhaseData.js";
import {HoomanPhaseHooman} from "./HoomanPhaseHooman.js";
import {HoomanPhaseLibrary} from "./HoomanPhaseLibrary.js";
import {HoomanPhaseModules} from "./HoomanPhaseModules.js";
import {HoomanPhaseRules} from "./HoomanPhaseRules.js";
import {HoomanPhaseStructure} from "./HoomanPhaseStructure.js";
import {HoomanPhaseSyntax} from "./HoomanPhaseSyntax.js";
import {HoomanPhaseUndefined} from "./HoomanPhaseUndefined.js";

import {HoomanStructureInfo} from "./HoomanStructureInfo.js";
import {HoomanStackDocuments} from "./HoomanStackDocuments.js";
import {HoomanDocument} from "./HoomanDocument.js";
import {HoomanStackLimbs} from "./HoomanStackLimbs.js";
import {HoomanStackInfos} from "./HoomanStackInfos.js";
import {HoomanStackStreams} from "./HoomanStackStreams.js";
import {HoomanRules} from "./HoomanRules.js";

export class HoomanParser {

    _currentPhase;
	
	constructor(embodiment) {
		
        this.resolve = null;
        this.reject = null;
		this.currentState = null;
		this._currentPhase = null;
		this.stackDocuments = new HoomanStackDocuments(this);
		this.stackLimbs = new HoomanStackLimbs();
		this.stackInfos = new HoomanStackInfos(this);
        this.stackStreams = new HoomanStackStreams();
		this.compound = null;
		this.embodiment = embodiment;
		this.thenOccurred = false;
		this.structureInfo = null;
		this.rules = new HoomanRules(this);
		this.currentRule = null;

		this.stateAssignment = new HoomanStateAssignment(this);
		this.stateBOM = new HoomanStateBOM(this);
		this.stateFinal = new HoomanStateFinal(this);
		this.stateGuillemotBegin = new HoomanStateGuillemotBegin(this);
		this.stateGuillemotBody = new HoomanStateGuillemotBody(this);
		this.stateGuillemotEnd = new HoomanStateGuillemotEnd(this);
		this.stateGuillemotIndentation = new HoomanStateGuillemotIndentation(this);
		this.stateIncludeSub = new HoomanStateIncludeSub(this);
		this.stateIncludeText = new HoomanStateIncludeText(this);
		this.stateIndentation = new HoomanStateIndentation(this);
		this.stateInitial = new HoomanStateInitial(this);
		this.stateLessThan = new HoomanStateLessThan(this);
		this.statePlus = new HoomanStatePlus(this);
		this.stateRemark = new HoomanStateRemark(this);
		this.stateThen = new HoomanStateThen(this);
		this.stateValue = new HoomanStateValue(this);
		this.stateVariable = new HoomanStateVariable(this);

		this.stateAssignment.initialize();
		this.stateBOM.initialize();
		this.stateFinal.initialize();
		this.stateGuillemotBegin.initialize();
		this.stateGuillemotBody.initialize();
		this.stateGuillemotEnd.initialize();
		this.stateGuillemotIndentation.initialize();
		this.stateIncludeSub.initialize();
		this.stateIncludeText.initialize();
		this.stateIndentation.initialize();
		this.stateInitial.initialize();
		this.stateLessThan.initialize();
		this.statePlus.initialize();
		this.stateRemark.initialize();
		this.stateThen.initialize();
		this.stateValue.initialize();
		this.stateVariable.initialize();

        this.phaseBeginData = new HoomanPhaseBeginData(this);
		this.phaseData = new HoomanPhaseData(this);
		this.phaseHooman = new HoomanPhaseHooman(this);
		this.phaseLibrary = new HoomanPhaseLibrary(this);
		this.phaseModules = new HoomanPhaseModules(this);
		this.phaseRules = new HoomanPhaseRules(this);
		this.phaseStructure = new HoomanPhaseStructure(this);
		this.phaseSyntax = new HoomanPhaseSyntax(this);
		this.phaseUndefined = new HoomanPhaseUndefined(this);

		this.includedDocuments = [];
		this.modules = [];
		
	}

    get document () {
		return this.stackDocuments.top;
    }

    get currentPhase () {
        return this._currentPhase;
    }

    set currentPhase (value) {

        this._currentPhase = value;

        if (this._currentPhase instanceof HoomanPhaseSyntax) {

            let syntaxLevel = this.compound.syntaxLevel;

            if (this.stackDocuments.topIndex > 1) {

                if (syntaxLevel == 0) {

                    this.compound.syntaxLevel = 2;

                }
                else if (syntaxLevel == 1) {

                    // Tested [TestSafeSyntax1]
                    let doc = "";
                    let line = 0;
                    let code = 4;
                    let message = "A syntactic section already exists in the main document";
                    this.reject({message: message, document: doc, line: line, code: code});
                    throw new Error(message);
    
                }

            }
            else if (syntaxLevel == 0) {

                this.compound.syntaxLevel = 1;
            
            }
            else if (syntaxLevel == 2) {

                // Tested [TestSafeSyntax2]
                let doc = "";
                let line = 0;
                let code = 5;
                let message = "A syntactic section already exists in an included document";
                this.reject({message: message, document: doc, line: line, code: code});
                throw new Error(message);

            }

        }

    }

    changeState (newState, nextChar) {

        // Eseguo la procedura di abbandono dello stato
        this.currentState.complete();

        // Imposto il nuovo stato
        this.currentState = newState;

        // Inizializzo lo stato
        this.currentState.reset();

        if (nextChar !== null) {

            // Passo il simbolo che ha determinato il cambio di stato
            this.currentState.nextSymbol(nextChar);

        }

    }

    startProcess(name, streamIn) {

        this.compound = new HoomanCompound();
        this.currentState = this.stateInitial;
        this.currentPhase = this.phaseUndefined;
        this.structureInfo = new HoomanStructureInfo(this, "_ROOT");

        this.includedDocuments = [];
        this.stackDocuments.reset();
        
		// Base della pila dei documenti
        this.stackDocuments.push(new HoomanDocument(this, "", 0));

        this.stackLimbs.reset();
        this.stackLimbs.push(this.compound);

        this.stackInfos.reset();
        this.stackInfos.push(this.structureInfo);

        this.modules = [];

        this.currentRule = null;

        this.rules.clear();

        //this.currentState = new HoomanStateInitial(this);

        this.stackDocuments.push(new HoomanDocument(this, name, this.stackDocuments.top.indentation));

        this.stackStreams.reset();
        this.stackStreams.push(streamIn);

        this.streamProcess(streamIn);

    }
  
    streamProcess (streamIn) {

        try {

            do {

                let currChar = streamIn.getNext();

                if (currChar == "") {

                    this.currentState.finalCheck();
                    this.changeState(this.stateFinal, null);
                    this.stackDocuments.pop();

                    this.stackStreams.pop();

                    if (this.stackStreams.topIndex >= 0) {

                        if (this.document.guillemotSession) {

                            this.currentState = this.stateGuillemotIndentation;
                        }
                        else {
                            
                            this.currentState = this.stateIndentation;
                        
                        }

                        this.streamProcess (this.stackStreams.top);
                    }
                    else {

                        //------------------------------------------------------
                        // Se nel documento non ci sono dati forzo la fase dati
                        //------------------------------------------------------

                        this.currentPhase = this.phaseBeginData;
                        this.currentPhase.stackManagement(null);
            
                        //------------------------------------------------------
                        // Eseguo i controlli sui dati mandatori e sulle regole
                        //------------------------------------------------------

                        this.rules.syntaxCheck();

                        //-------------------------------------------
                        // Eseguo i controlli sui moduli obbligatori
                        //-------------------------------------------

                        for (var m of this.modules) {

                            if (this.compound.inclusions.indexOf(m) == -1) {

                                // Tested [TestMandatoryModule]
                                let doc = "";
                                let line = 0;
                                let code = 6;
                                let message = "Module [ {0} ] is required".format(m);
                                this.reject({message: message, document: doc, line: line, code: code});
                                throw new Error(message);
                    
                            }

                        }

                        this.resolve(this.compound);

                    }

                    break;

                }

                let top = this.stackDocuments.top;

                if (top.inputManagement(currChar)) {
                    if (this.currentState.nextSymbol(currChar)) {
                        break;
                    }
                }

                // Gestione prossima riga
                if (top.newLine) {
                    top.row++;
                    top.newLine = false;
                }

            } while (true);
            
        }
        catch (ex) {

            let doc = "";
            let line = 0;
            let code = 26;
            this.reject({message: ex.message, document: doc, line: line, code: code});

        }

    }

    stackManagement (name) {

        let l = this.currentPhase.bodyBuilder(name);

        this.currentPhase.stackManagement(l);

    }

}
