// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanStatics} from "./HoomanStatics.js";
import {HoomanLimb} from "./HoomanLimb.js";

export class HoomanLimbs {

    _collItem = new Map();
    _collIndex = [];

    parent;
    nextIndex;

	constructor(parent) {

        this.parent = parent;
        this.nextIndex = 0;

	}
	
    getValue (name, defaultValue = null) {

        name = name.toLowerCase();

        if (defaultValue !== null) {

            if (this._collItem.has(name)) {
                return this._collItem.get(name).simpleValue;
            }
            else {
                return defaultValue;
            }

        }
        else {

            if (this._collItem.has(name)) {
                return this._collItem.get(name).complexValue;
            }
            else{
                return new HoomanLimbs(this.parent);
            }

        }

    }

    getLimb (name) {

        name = name.toLowerCase();

        if (this._collItem.has(name)) {
            return this._collItem.get(name);
        }
        else {
            return new HoomanLimb(name, this.parent);
        }

    }

    setLimb (limb) {

        if (limb.valueType == HoomanStatics.typeSimple) {

            var name = limb.name.toLowerCase();

            if (this._collItem.has(name)) {

                var prevItem = this._collItem.get(name);

                if (prevItem.valueType == HoomanStatics.typeSimple) {

                    limb.owner = prevItem.owner;

                    this._collItem.delete(name);

                    if (limb.simpleValue == null) {
                        limb.simpleValue = "";
                    }
         
                    this._collItem.set(name, limb);
                }
                else {

                    limb = prevItem;

                }
            }
            else {

                if (limb.simpleValue === null) {
                    limb.simpleValue = "";
                }

                this._collItem.set(name, limb);
                this._collIndex[this.nextIndex] = name;
                this.nextIndex++;

            }
        }
        else {

            throw new Error("Internal error");

        }

        return limb;

    }

    getLimbByIndex (index) {

        if (this._collIndex[index]) {
            return this._collItem.get( this._collIndex[index] );
        }
        else {
            throw new Error("Index out of range");
        }

    }

    count () {
        return this._collItem.size;
    }

    clear () {

        this._collItem.clear();
        this._collIndex = [];
        this.nextIndex = 0;

    }

    exists (name) {
        return this._collItem.has(name);
    }

    get last() {

        if (this.nextIndex > 0) {
            return this._collItem.get(this._collIndex[ this.nextIndex - 1 ]);
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
