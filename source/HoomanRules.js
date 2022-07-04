// Copyright (c) 2021 - Rodolfo Calzetti
// Hooman v2 Parser
// MIT License 

'use strict';

import {HoomanStatics} from "./HoomanStatics.js";
import {HoomanExport2JSON} from "./HoomanExport2JSON.js";
import {HoomanEngineJS} from "./HoomanEngineJS.js";

export class HoomanRules {

    _parser;

    scriptJS;
    functProgr;
    engineJS;

    hasSyntaxStructure;
    hasSyntaxRules;

    structureInfo;
    stackInfos;

    _collItem;
    _collFields;
    _collIndex;
    
	constructor(parser) {

        this._parser = parser;
        this.scriptJS = [];
        this.functProgr = 0;
        this.stackInfos = parser.stackInfos;

        this._collItem = new Map();
        this._collFields = new Map();
        this._collIndex = new Map();

	}

    count () {
        return this._collItem.size;
    }

    add (item) {

        var name = item.name.toLowerCase();
        this._collItem.set(name, item);

	}

    clear () {

        this._collItem.clear();
        this._collIndex.clear();

        this.hasSyntaxStructure = false;
        this.hasSyntaxRules = false;

        this.scriptJS = [];
        this.functProgr = 0;

    }

    addField (name, info) {

        this._collFields.set(name, info);

    }

    getRules (name) {

        if (this._collIndex.has(name.toLowerCase())) {
            return this._collIndex.get(name.toLowerCase());
        }
        else {
            return null;
        }

    }

    checkRules (checkType) {

        for (let k of this._collFields) {

            var limb = k[1];
            var id = limb.name.toLowerCase();
            var vl = limb.simpleValue;
            var dr = limb.docRef;
            var rw = limb.row;

            var rules = this.getRules(id);

            if (rules !== null) {

                for (let r of rules) {

                    var ok = true;
                    var condExists = (r.contexts.size == 0);
                    var idRule = "";
                    var vlRule = "";
                    var tgRule = "";
                    var regex;
                    var matchRule;

                    for (let context of r.contexts) {

                        idRule = context.name.toLowerCase();
                        vlRule = context.pattern;

                        if (this._collFields.has(idRule)) {

                            condExists = true;

                            regex = new RegExp("^" + vlRule + "$", "i");
                            matchRule = this._collFields.get(idRule).simpleValue.match(regex);

                            if (matchRule == null) {

                                // Non tutte le precondizioni sono verificate
                                ok = false;
                                break;

                            }
                        
                        }
                        else {

                            // Tested [TestRuleViolation5]
                            let doc = this._parser.includedDocuments[dr].tagName;
                            let line = rw;
                            let code = 15;
                            let message = "{0}Simple variable [ {1} ] is mandatory because it is precondition in a rule at row {2}".format(doc, idRule, line);
                            this._parser.reject({message: message, document: doc, line: line, code: code});
                            throw new Error(message);
                
                        }

                    }

                    if (ok && condExists) {

                        //----------------------------
                        // Preconditions are verified
                        //----------------------------

                        for (let clause of r.clauses) {

                            idRule = clause.name.toLowerCase();
                            vlRule = clause.pattern;
                            tgRule = clause.tag.toLowerCase();

                            if (idRule == id) {

                                let checkDate = false;
                                let checkNumber = false;
                                let codeJS = false;

                                if (tgRule.startsWith("date")) {
                                    checkDate = true;
                                }
                                else if (tgRule.startsWith("number")) {
                                    checkNumber = true;
                                }
                                else if (tgRule == "js") {
                                    codeJS = true;
                                }

                                if (checkType == 1 && codeJS) {

                                    this.assignLimb(limb, vlRule);

                                }
                                else if (checkType == 0 && !codeJS) {

                                    regex = new RegExp("^" + vlRule + "$", "i");
                                    matchRule = vl.match(regex);
        
                                    if (matchRule == null) {

                                        // Tested [TestRuleViolation]
                                        let doc = this._parser.includedDocuments[dr].tagName;
                                        let line = rw;
                                        let code = 16;
                                        let message = "{0}The [ {1} {2} ] assignment does not match the pattern at row {3}".format(doc, id, vl, line);
                                        this._parser.reject({message: message, document: doc, line: line, code: code});
                                        throw new Error(message);
                            
                                    }
                                    else if (checkDate) {

                                        let ye = 0;
                                        let mo = 0;
                                        let da = 0;
                                        let ho = 0;
                                        let mi = 0;
                                        let se = 0;
                                        let dateTest;

                                        if ((matchRule.length - 1) >= 3) {

                                            switch (tgRule) {

                                            case "date[ymd]":
                                            case "date":

                                                ye = parseInt(matchRule[1]);
                                                mo = parseInt(matchRule[2]);
                                                da = parseInt(matchRule[3]);
                                                break;

                                            case "date[dmy]":

                                                ye = parseInt(matchRule[3]);
                                                mo = parseInt(matchRule[2]);
                                                da = parseInt(matchRule[1]);
                                                break;

                                            case "date[mdy]":

                                                ye = parseInt(matchRule[3]);
                                                mo = parseInt(matchRule[1]);
                                                da = parseInt(matchRule[2]);
                                                break;

                                            default:

                                                // Tested [TestRuleViolation7]
                                                let doc = this._parser.includedDocuments[dr].tagName;
                                                let line = rw;
                                                let code = 17;
                                                let message = "{0}Unmanaged tag [ {1} ] at row {2}".format(doc, tgRule, line);
                                                this._parser.reject({message: message, document: doc, line: line, code: code});
                                                throw new Error(message);
                                    
                                            }
                                        }
                                        else {

                                            // Tested [TestRuleViolation6]
                                            let doc = this._parser.includedDocuments[dr].tagName;
                                            let line = rw;
                                            let code = 18;
                                            let message = "{0}Bad date pattern at row {1}: the groups must be 3, 5 or 6".format(doc, line);
                                            this._parser.reject({message: message, document: doc, line: line, code: code});
                                            throw new Error(message);
                                
                                        }

                                        switch (matchRule.length - 1) {

                                        case 3:
                                            break;

                                        case 5:

                                            ho = parseInt(matchRule[4]);
                                            mi = parseInt(matchRule[5]);
                                            break;

                                        case 6:

                                            ho = parseInt(matchRule[4]);
                                            mi = parseInt(matchRule[5]);
                                            se = parseInt(matchRule[6]);
                                            break;

                                        default:

                                            // Tested [TestRuleViolation4]
                                            let doc = this._parser.includedDocuments[dr].tagName;
                                            let line = rw;
                                            let code = 19;
                                            let message = "{0}Bad date pattern at row {1}: the groups must be 3, 5 or 6".format(doc, line);
                                            this._parser.reject({message: message, document: doc, line: line, code: code});
                                            throw new Error(message);
                                
                                        }

                                        dateTest = new Date(ye, mo - 1, da);

                                        if (dateTest.getFullYear() != ye || dateTest.getMonth() != (mo - 1) || dateTest.getDate() != da) {

                                            // Tested [TestRuleViolation2]
                                            let doc = this._parser.includedDocuments[dr].tagName;
                                            let line = rw;
                                            let code = 20;
                                            let message = "{0}Value is not a valid date at row {1}".format(doc, line);
                                            this._parser.reject({message: message, document: doc, line: line, code: code});
                                            throw new Error(message);
                                
                                        }

                                        if (ho > 23 || mi > 60 || se > 60) {

                                            // Tested [TestRuleViolation3]
                                            let doc = this._parser.includedDocuments[dr].tagName;
                                            let line = rw;
                                            let code = 21;
                                            let message = "{0}Value is not a valid datetime at row {1}".format(doc, line);
                                            this._parser.reject({message: message, document: doc, line: line, code: code});
                                            throw new Error(message);
                                
                                        }

                                        limb.actualValue = dateTest;
                                    }
                                    else if (checkNumber) {

                                        let numberTest = 0;

                                        if ( (/^(number|number\[\.\d*\])$/i).test(tgRule) ) {
                                            
                                            if ( (/^\d+(\.\d+)?$/).test(vl) ) {
                                                numberTest = parseFloat(vl);
                                            }
                                            else {

                                                // Tested [TestRuleViolation8]
                                                let doc = this._parser.includedDocuments[dr].tagName;
                                                let line = rw;
                                                let code = 22;
                                                let message = "{0}Value is not a valid number at row {1}".format(doc, line);
                                                this._parser.reject({message: message, document: doc, line: line, code: code});
                                                throw new Error(message);
                                    
                                            }

                                        }
                                        else if ( (/^number\[,\d*\]$/i).test(tgRule) ) {

                                            if ( (/^\d+(,\d+)?$/).test(vl) ) {
                                                // Tested [TestValidExpression]
                                                numberTest = parseFloat(vl.replace(",", "."));
                                            }
                                            else {

                                                // Tested [TestRuleViolation9]
                                                let doc = this._parser.includedDocuments[dr].tagName;
                                                let line = rw;
                                                let code = 23;
                                                let message = "{0}Value is not a valid number at row {1}".format(doc, line);
                                                this._parser.reject({message: message, document: doc, line: line, code: code});
                                                throw new Error(message);
                                    
                                            }

                                        }
                                        else {

                                            // Tested [TestRuleViolation10]
                                            let doc = this._parser.includedDocuments[dr].tagName;
                                            let line = rw;
                                            let code = 24;
                                            let message = "{0}Unmanaged tag [ {1} ] at row {2}".format(doc, tgRule, line);
                                            this._parser.reject({message: message, document: doc, line: line, code: code});
                                            throw new Error(message);
                                
                                        }

                                        limb.actualValue = numberTest;

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    clearFields () {

        this._collFields.clear();

    }

    ruleIndexing () {

        for (let k of this._collItem) {

            var rule = k[1];

            // Scandisco la collezione delle post-condizioni per indicizzare i campi di attivazione delle regole
            for (let c of rule.clauses) {

                var name = c.name.toLowerCase();
                var rules;

                if (this._collIndex.has(name)) {

                    rules = this._collIndex.get(name);
                
                }
                else {

                    rules = [];
                    this._collIndex.set(name, rules);

                }

                rules.push(rule);

            }

        }

    }

    syntaxCheck() {

        if (this.hasSyntaxStructure || this.hasSyntaxRules) {

            this.ruleIndexing();

            //----------------------------------------------------------
            // Esecuzione ricorsiva delle regole di validazione (regex)
            //----------------------------------------------------------

            this.structureInfo = this._parser.structureInfo;
            this.stackInfos.reset();
            this.stackInfos.push(this.structureInfo);

            this._recursiveCheck(this._parser.compound, this.structureInfo, 0, 0);

            //-----------------
            // Gestione script 
            //-----------------

            this.engineJS = null;

            if (this.functProgr > 0) {

                this._parser.compound.isDynamic = true;

                this.scriptJS.push("var SELF=false;");
                this.scriptJS.push("\n");
                this.scriptJS.push("var BRANCH={};");
                this.scriptJS.push("\n");
                this.scriptJS.push("var PATH=[];");
                this.scriptJS.push("\n");
                this.scriptJS.push("var HOO=");

                var jsonHoo = new HoomanExport2JSON(this._parser.compound, false);

                // for debugging
                //console.log(jsonHoo.export());

                this.scriptJS.push(jsonHoo.export());

                this.scriptJS.push(";");
                this.scriptJS.push("\n");

                // Oggetto TABULAR 

                //this.scriptJS.push("var TABULAR={};");
                //this.scriptJS.push("\n");

                //if (this._parser.compound.pathExists("hooman/syntax/structure/_tabular")) {
                if (this._parser.compound.pathExists("hooman/syntax/tabular")) {

                    let valLimb = this._parser.compound.getLimb("hooman").getLimb("syntax").getLimb("tabular");
                    let _tabular = {};

                    if (valLimb.valueType == HoomanStatics.typeComplex) {
                        let valLimbs = valLimb.complexValue;
                        for (let v of valLimbs) {
                            if (v.valueType == HoomanStatics.typeComplex) {
                                let valSing = v.complexValue;
                                let h = [];
                                for (let z of valSing) {
                                    if (z.valueType == HoomanStatics.typeSimple) {
                                        h.push(z.simpleValue);
                                    }
                                }
                                //_tabular[v.name.toLowerCase()] = "|" + h.join("|") + "|";
                                _tabular[v.name.toLowerCase()] = h;
                            }
                        }
                    }
            
                    //for (let i in _tabular) {
                    //    this.scriptJS.push("TABULAR['" + i + "']='" + _tabular[i] + "'");
                    //    this.scriptJS.push("\n");
                    //}
                    this.scriptJS.push("var TABULAR=");
                    this.scriptJS.push(JSON.stringify(_tabular));
                    this.scriptJS.push(";\n");

                }
                else {

                    this.scriptJS.push("var TABULAR={};\n");

                }

                // Caricamento
                let sourceJS = this.scriptJS.join("");
                this.engineJS = new HoomanEngineJS(sourceJS);

                //-------------------------------------------------------
                // Esecuzione ricorsiva delle regole attive (javascript)
                //-------------------------------------------------------

                this.structureInfo = this._parser.structureInfo;
                this.stackInfos.reset();
                this.stackInfos.push(this.structureInfo);

                this._recursiveCheck(this._parser.compound, this.structureInfo, 1, 0);

            }

        }

    }

    _recursiveCheck(limb, info, checkType, level) {

        if (this.hasSyntaxStructure && 
            checkType == 0 && 
            info.hasMandatory && 
            !this._parser.compound.isSyntactic) {

            for (let f of info.infos) {

                if (f.isMandatory) {

                    if (!limb.complexValue.exists(f.name)) {

                        // Tested [TestMandatory]
                        let doc = this._parser.includedDocuments[limb.docRef].tagName;
                        let line = limb.row;
                        let code = 25;
                        let message = "{0}Variable [ {1} ] is mandatory below the row {2}".format(doc, f.name, line);
                        this._parser.reject({message: message, document: doc, line: line, code: code});
                        throw new Error(message);
            
                    }

                }

            }

        }

        if (this.hasSyntaxRules) {
            this.clearFields();
        }

        for (let l of limb.complexValue) {

            if (level > 0 || l.name.toLowerCase() != "hooman") {

                if (l.valueType == HoomanStatics.typeSimple) {

                    if (this.hasSyntaxRules) {
                        this.addField(l.name.toLowerCase(), l);
                    }
                
                }

            }

        }

        if (this.hasSyntaxRules) {
            this.checkRules(checkType);
        }

        for (let l of limb.complexValue) {

            if (level > 0 || l.name.toLowerCase() != "hooman") {

                if (l.valueType == HoomanStatics.typeComplex) {

                    if (this.hasSyntaxStructure) {

                        let infoAux = null;

                        if (this.stackInfos.top.hasWildcard) {
                            infoAux = this.stackInfos.top.infos.first;
                        }
                        else {
                            infoAux = this.stackInfos.top.infos.getInfo(l.name);
                        }

                        this.stackInfos.push(infoAux);
                        this._recursiveCheck(l, this.stackInfos.top, checkType, level + 1);
                        this.stackInfos.pop();
                    }
                    else {

                        this._recursiveCheck(l, null, checkType, level + 1);

                    }

                }

            }

        }

    }

    assignLimb (limb, formula) {

        this.engineJS.execute("BRANCH=HOO");
        this.engineJS.execute("PATH=[]");

        var maxPath = -1;
        var p = [];

        var l = limb;

        while (l.parent != null) {

            let name = l.parent.name.toLowerCase();

            if (/^\d/.test(name)) {
                name = "i" + name;
            }

            maxPath++;
            p[maxPath] = name;

            l = l.parent;

        }

        for (let i = maxPath - 1; i >= 0; i--) {

            this.engineJS.execute("BRANCH=BRANCH['" + p[i] + "']");
            this.engineJS.execute("PATH.push('" + p[i] + "')");

        }

        this.engineJS.execute("SELF=BRANCH['" + limb.name.toLowerCase() + "']");

        let result = this.engineJS.invoke(formula);
        let sResult;

        if (result instanceof Date) {

            sResult =  ("0" + result.getDate()).slice(-2) + "-" + 
            ("0"+(result.getMonth()+1)).slice(-2) + "-" +
            result.getFullYear() + "T" + 
            ("0" + result.getHours()).slice(-2) + ":" + 
            ("0" + result.getMinutes()).slice(-2) + ":" +
            ("0" + result.getSecond()).slice(-2) //
            .replace("T00:00:00", "");

        }
        else {

            sResult = result.toString();

        }

        limb.simpleValue = sResult;

    }


    [Symbol.iterator] = function * () {
        for (let pair of this._collItem) {
            yield pair[1]; 
        }       
    }

}
