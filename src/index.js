const express = require("express");

const app = express();
const port = 3000;

const request_gens = require("./routers/request_gens.js");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-origin", "*")
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

app.use('/reqgen', request_gens);

app.get("/", (req, res) => {
    res.send("Stratice is alive.").status(200);
});

app.listen(port, () => {
    console.log("[Stratice] [API]: API is listening on port " + port);
});
