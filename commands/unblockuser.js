const sql = require("sqlite");
sql.open("./db/data.sqlite");
const config = require('../config.json');

exports.run = (client, message, args) => {
    if(message.author.id === config.ownerID) {
    sql.get(`SELECT * FROM bannedusers WHERE discordid = "${args[0]}"`).then(row => {
        if (!row) {
                message.channel.send("This user isn't blocked!")
            } else {
                sql.run(`DELETE FROM bannedusers WHERE discordid = "${args[0]}"`).then(() => {
                    message.channel.send("User unblocked!");
                });
            }
        });
} else {
    message.channel.send("You do not have permission to do this!")
}
}