const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 3001;
let ctx;

async function initMongoose() {
    await mongoose.connect(process.env.MONGO_URI || '', {
        keepAlive: true,
        dbName: "StraticeAuth"
    });

    ctx = mongoose;
};
initMongoose();

const request_gens = require("./routers/request_gens.js");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-origin", "localhost")
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

app.use('/reqgen', request_gens(ctx));

app.get("/", (req, res) => {
    res.send("Stratice is alive.").status(200);
});

app.listen(port, () => {
    console.log("[Stratice] [API]: API is listening on port " + port);
});
