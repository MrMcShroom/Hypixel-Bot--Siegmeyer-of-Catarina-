// JavaScript source code
const MojangAPI = require('mojang-api');
const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./db/data.sqlite");
exports.run = (client, message, args) => {
const username = args[0];
var date = new Date();
if (message.mentions.users.first()) {
    sql.get(`SELECT * FROM hypixel WHERE discordid ="${message.mentions.users.first().id}"`).then(row => {
        if (!row) return message.reply("This user has not linked their Minecraft account!");
        uuid = row.uuid;
        console.log(`On ${date} ${message.mentions.users.first()}'s UUID was ${uuid}`);
        message.channel.send(`On ${date} ${message.mentions.users.first()}'s UUID was ${uuid}`);
    });
}
    else {
if(username === undefined) {
    sql.get(`SELECT * FROM hypixel WHERE discordid ="${message.author.id}"`).then(row => {
        if (!row) return message.reply("To pull your own stats you must use `!hypixelverify`, otherwise please input a username.");
        uuid = row.uuid;
        console.log(`On ${date} ${message.author.tag}'s UUID was ${uuid}`);
        message.channel.send(`On ${date} ${message.author.tag}'s UUID was ${uuid}`);
    });
}
else {
    MojangAPI.uuidAt(username, date, (err, res) => {
        if (err) {
            console.log(err);
    message.channel.send("There was an error, or that account doesn't exist!");
} else {
    console.log(`On ${date} ${username}'s UUID was ${res.id}`);
message.channel.send(`On ${date} ${username}'s UUID was ${res.id}`);
}
});
}
}
}
