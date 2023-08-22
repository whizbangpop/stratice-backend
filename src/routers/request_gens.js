const Express = require("express");
const Router = Express.Router();
const MySQL = require('mysql2');
const fs = require("node:fs");
const mongoose = require("mongoose");

const conn = MySQL.createConnection({
    host: "stratice-db2-stratice.aivencloud.com",
    port: 12921,
    user: "avnadmin",
    password: "AVNS_kSBKAKcfDlWWLorUrA_",
    database: "defaultdb",
    ssl: {
        ca: fs.readFileSync(__dirname + '/ca.cer')
    }
});

Router.use(Express.json());

Router.post("/newauth", (req, res) => {
    const username = req.body.user.username;
    const serverId = req.body.server.id;

    const requestUUID = generateUUID();
    const userUUID = generateUUID();

    

    conn.connect()

    conn.query(`SELECT * FROM userReg WHERE \`DiscordUserID\` = '${username}';`, (err, rows, fields) => {
        if (err) throw err;

        const row = rows[0];

        if(!rows[0]) {
            conn.query(`INSERT INTO \`userReg\` (\`UserID\`, \`AuthID\`, \`DiscordUserID\`, \`DiscordGuildID\`) VALUES ('${userUUID}', '${requestUUID}', '${username}', '${serverId}');`, (err, rows, fields) => {
                if (err) throw err
            })

            conn.end()
            return res.json({authUrl: `https://notable-weasel-surely.ngrok-free.app/reqgen/authreg/${requestUUID}`, straticeUUID: userUUID});
        } else {
            conn.end()
            return res.json({authUrl: `https://notable-weasel-surely.ngrok-free.app/reqgen/authreg/${row.AuthID}`, straticeUUID: row.UserID});
        }
    })
});

Router.get("/authreg/:authid", async (req, res) => {
    try {
        await conn.connect();

        conn.query(`SELECT * FROM userReg WHERE \`AuthID\` = '${req.params.authid}';`, (err, rows, fields) => {
            if (err) throw err;
            if (rows[1]) throw err && conn.end();
    
            const row = rows[0];

    
            conn.query(`INSERT INTO \`RegisteredUsers\` (\`UserID\`, \`RegisteredGuild\`, \`DiscordUserID\`) VALUES ('${row.UserID}', '${row.DiscordGuildID}', '${row.DiscordUserID}');`, (err, rows, fields) => {
                if (err) throw err;
    
                conn.query(`UPDATE \`userReg\` SET \`AuthSuccess\` = 1 WHERE \`AuthID\` = '${req.params.authid}';`, (err, rows, fields) => { if (err) throw err })
            })
        });
    } catch (err) {
        conn.destroy()
        throw err
    } finally {
        // conn.end()
    }

    return res.redirect('../../welcome/')
});

Router.get('/dbcmd', (req, res) => {
    conn.connect()
    conn.query('CREATE TABLE userReg (UserID varchar(255), AuthID, varchar(255), DiscordID int);', (err, rows, fields) => {
        if (err) throw err;

        const row = rows[0];

        conn.query
    })
    conn.end()
})


module.exports = Router;


function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}