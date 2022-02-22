// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

export class HoomanStackStreams {
	
    _stack;
    _topIndex;
    _top;
    
    constructor () {
      
          this._stack = [];
          this._topIndex = -1;
          this._top = null;

    }
	
    push (elem) {

        this._topIndex++;
        this._stack[this._topIndex] = elem;
        this._top = elem;

    }

    pop () {

        this._stack.pop();
        this._topIndex--;
        this._top = this._stack[ this._topIndex ];

    }

    reset () {

        this._stack = [];
        this._topIndex = -1;
        this._top = null;

    }

    get topIndex () {
		return this._topIndex;
    }

    get top () {
		return this._top;
    }
	
}
