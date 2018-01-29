const sql = require("sqlite");
sql.open("./db/data.sqlite");

exports.run = (client, message, args, config) => {
    if(message.author.id === config.ownerID) {
        sql.run("DROP TABLE discord").then(() => {
        message.channel.send("I deleted the discord data.");
        console.log("Cleared the discord table.")
        });
} else {
    message.reply("You don't have permission to do this!");
}
};