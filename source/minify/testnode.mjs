import {HoomanService} from "./hoomanode.mjs";
import {HoomanStatics} from "./hoomanode.mjs";
import {HoomanEmbodimentFile} from "./hoomanode.mjs";

var e = new HoomanEmbodimentFile("D:/Ingegneria/js/Hooman/fud/");
var s = new HoomanService(e);

var prom = s.parseFile("demomain.fud");	
var h = [];
prom
	.then( k => {

		recursiveDump(k.complexValue, 0);
		console.log(h.join(""));
		
	})
	.catch( err => {
		console.log(err);
	});

function recursiveDump (limbs, level) {

	for (let l of limbs) {
		for (let i=0; i<4*level; i++) {
			h.push(" ");
		}
		
		h.push(l.name);
		
		if (l.valueType == HoomanStatics.typeComplex) {
			h.push("\r\n");
			recursiveDump(l.complexValue, level+1);
		}
		else {
			h.push(" ");
			h.push(l.simpleValue.replace(/\n/g, "\r\n"));
			h.push("\r\n");
		}
	}
}
