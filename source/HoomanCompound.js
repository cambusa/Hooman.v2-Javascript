// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanLimb} from "./HoomanLimb.js";
import {HoomanStatics} from "./HoomanStatics.js";

export class HoomanCompound {
	
	version = 1;
	objectType = "HoomanCompound";
	
	constructor() {

        this.limb = new HoomanLimb("_ROOT", null);
        this.classifier = "";
        this.inclusions = [];
        this.isDynamic = false;
		this.isSyntactic = false;
        this.hasWildcard = false;
		this.syntaxMain = false;
		this.syntaxIncluded = false;

	}
	
	get complexValue () {
		return this.limb.complexValue;
	}

	get name () {
		return this.limb.name;
	}

	getSimpleValue () {
		return "";
	}

	getActualValue () {
		return "";
	}

	getValueType () {
		return HoomanStatics.typeComplex;
	}
	
	prune () {
		this.limb.prune();
	}

	count () {
		this.limb.count();
	}
	
	pathValue (pathName, defaultValue = "") {
		
		try {

			let pathArray = pathName.split("/");
			let l = this.limb.complexValue;
			let i;

			for (i = 0; i <= pathArray.length - 2; i++) {
				l = l.getLimb( pathArray[i] ).complexValue;
			}

			return l.getLimb( pathArray[i] ).simpleValue;

		}
		catch (ex) {
			return defaultValue;
		
		}

	}

	pathLimb (pathName) {
		
		try {

			let pathArray = pathName.split("/");
			let l = this.limb.complexValue;
			let i;

			for (i = 0; i <= pathArray.length - 2; i++) {
				l = l.getLimb( pathArray[i] ).complexValue;
			}

			return l.getLimb( pathArray[i] );

		}
		catch (ex) {
			return false;
		}

	}

	pathLimbs (pathName) {
		
		try {

			let pathArray = pathName.split("/");
			let l = this.limb.complexValue;
			let i;

			for (i = 0; i <= pathArray.length - 1; i++) {
				l = l.getLimb( pathArray[i] ).complexValue;
			}

			return l;

		}
		catch (ex) {
			return false;
		}

	}

	pathExists (pathName) {

		try {
		
			let pathArray = pathName.split("/");
			let l = this.limb.complexValue;
			let i;
			let e = true;

			for (i = 0; i <= pathArray.length - 2; i++) {
				if (l.exists(pathArray[i])) {
					l = l.getLimb( pathArray[i] ).complexValue;
				}
				else {
					e = false;
					break;
				}
			}

			if (e && !l.exists(pathArray[i])) {
				e = false;
			}

			return e;
		
		}
		catch (ex) {
		
			return false;
		
		}

	}

	get root () {
		return this.limb;
	}
	
	getValue (name, defaultValue = "") {
		return this.limb.complexValue.getValue(name, defaultValue);
	}
	
	getLimb (name) {
		return this.limb.complexValue.getLimb(name);
	}
	
	getLimbs (name) {
		return this.limb.complexValue.getLimbs(name);
	}
	
    get lastLimb () {

		if (this.limb.complexValue.count() > 0) {
			return this.limb.complexValue.last;
		}
		else {
			return new HoomanLimb("0", this.limb);
		}

    }

    get tag () {
        return this.limb.tag;
    }

	set tag (value) {
		this.limb.tag = value;
	}

    get row () {
		return 0;
    }

    get level () {
		return -1;
    }

    get docRef () {
		return 1;
    }

    get owner () {
		return 0;
    }

    get parent () {
		return null;
    }

    get isWildcard () {
		return false;
    }

    buildPath () {
        return "";
    }

}
