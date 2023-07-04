# Hooman.v2-Javascript
__Javascript parser for Hooman v2 metalanguage - 2023 Rodolfo Calzetti__

_License: MIT_

A hooman document _"demomain.fud"_ is given:
```
hooman
    version 2
    classifier demo
<-- demosyntax.fud

fields
    name
        value Johann Sebastian Bach

    amount
        type number
        value 23.45

    tradedate
        type date
        value 2021-03-31
```
The simplest use cases for NodeJS are listed below:
```
const {HoomanService, HoomanEmbodimentFile} = require ("./hooman/hoomanode");

var e = new HoomanEmbodimentFile("c:/dev/");
var s = new HoomanService(e);

s.parseFile("demomain.fud")
.then ( (compound) => {

    let v;

    // Get limb and his simple value
    v = k.pathLimb("fields/tradedate/value").simpleValue;
    console.log(v);

    // Get value with default ######
    v = k.pathValue("fields/tradedate/valuex", "######");
    console.log(v);

    // Scan a complex value
    let x = k.pathLimb("fields").complexValue;
    for (let l of x) {
        console.log(l.name);
    }
})
.catch ((err) => {
    // err.message 
})
```

