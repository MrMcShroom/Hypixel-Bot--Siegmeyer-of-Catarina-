const sql = require("sqlite");
sql.open("./db/data.sqlite");
const config = require('../config.json');

exports.run = (client, message, args) => {
    if(message.author.id === config.ownerID) {
    sql.get(`SELECT * FROM bannedusers WHERE discordid = "${args[0]}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO bannedusers (discordid) VALUES (?)", [args[0]]);
            message.channel.send("User has been blocked!");
            } else {
                message.channel.send("This user has already been blocked!");
            }
        });
} else {
    message.channel.send("You do not have permission to do this!")
}
}