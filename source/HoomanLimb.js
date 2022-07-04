// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanStatics} from "./HoomanStatics.js";
import {HoomanLimbs} from "./HoomanLimbs.js";

export class HoomanLimb {
	
    name;
    tag;
    valueType;
    _simpleValue;
    _actualValue;
    _complexValue;
    row;
    level;
    docRef;
    owner;
    parent;
    isWildcard;
    hasWildcard;
    isRecursive;
	objectType = "HoomanLimb";

	constructor(name, parent, value = "", docRef = -1, row =-1) {

        this.name = name;
        this.parent = parent;
        this.tag = "";

		if (docRef >= 0) {
			this.valueType = HoomanStatics.typeSimple;
        }
		else {
        	this.valueType = HoomanStatics.typeComplex;
        }

        this._simpleValue = value;
        this._actualValue = value;
        this._complexValue = new HoomanLimbs(this);

		this.docRef = docRef;
        this.owner = docRef;
		this.row = row;

        if (parent) {
            this.level = parent.level + 1;
        }
        else {
            this.level = 0;
        }

        this.isWildcard = false;
        this.hasWildcard = false;
        this.isRecursive = false;

	}

    prune () {

        this.valueType = HoomanStatics.typeComplex;
        this._simpleValue = "";
        this._actualValue= "";
        this._complexValue.clear();

    }

    count () {
        return this._complexValue.count();
    }


    get simpleValue () {

        if (this.valueType == HoomanStatics.typeSimple) {
            return this._simpleValue;
        }
        else {
            throw new Error("Field [ {0} ] has complex value".format(this.name));
        }

    }

    set simpleValue (value) {

        if (this.valueType == HoomanStatics.typeSimple) {

            this._simpleValue = value;
            this._actualValue = value;

        }

    }

    get actualValue () {

        if (this.valueType == HoomanStatics.typeSimple) {
            return this._actualValue;
        }
        else {
            throw new Error("Coding error ref. [00002]");
        }

    }

    set actualValue (value) {
        this._actualValue = value;
    }

    get complexValue () {

        if (this.valueType == HoomanStatics.typeComplex) {
            return this._complexValue;
        }
        else {
            throw new Error("Coding error ref. [00003]");
        }

    }

	getValue (name, defaultValue = "") {
    	return this._complexValue.getValue(name, defaultValue);
	}

    getLimb (name) {
		return this._complexValue.getLimb(name);
	}
	
    getLimbs (name) {
		return this._complexValue.getLimbs(name);
	}
	
    get lastLimb () {

        if (this._complexValue.count() > 0) {
            return this._complexValue.last;
        }
        else {
            return new HoomanLimb("0", this);
        }

    }

    buildPath () {

        try {

            var maxPath = 0;
            var p = [];

            p[maxPath] = this.name;

            var l = this;

            while (l.parent != null) {

                let name = l.parent.name;

                if (name != "_ROOT") {

                    maxPath++;
                    p[maxPath] = name;

                }

                l = l.parent;

            }

            p = p.reverse();
            
            return p.join("/");
        
        }
        catch (ex) {

            throw new Error(ex.message);

        }

    }

}
