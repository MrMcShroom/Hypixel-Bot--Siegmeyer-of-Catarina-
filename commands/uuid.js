// JavaScript source code
const MojangAPI = require('mojang-api');
const Discord = require("discord.js");
exports.run = (client, message, args) => {
const username = args[0];
var date = new Date();
if(username === undefined) {
    message.channel.send("You didn't input a username. Sorry!")
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

