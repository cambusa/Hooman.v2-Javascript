// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanStructureInfos} from "./HoomanStructureInfos.js";

export class HoomanStructureInfo {

    _parser;

    name;
    isWildcard;
    hasWildcard;
    isRecursive;
    isDefault;
    defaultValue;
    hasDefault;
    isMandatory;
    hasMandatory;
    infos;

	constructor(parser, name) {
		
		this._parser = parser;
		
        this.name = name;
        this.isWildcard = false;
        this.hasWildcard = false;
        this.isRecursive = false;
        this.isDefault = false;
        this.defaultValue = "";
        this.hasDefault = false;
        this.isMandatory = false;
        this.hasMandatory = false;

        this.infos = new HoomanStructureInfos(parser);

	}

}
