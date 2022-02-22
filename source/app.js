const express = require("express");
const path = require("path");
const app = express();
app.use("/hooman", express.static(path.join(__dirname)));

app.listen(80, () => console.log('Server ready'))