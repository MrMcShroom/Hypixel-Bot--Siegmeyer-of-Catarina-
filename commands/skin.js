// JavaScript source code
const MojangAPI = require('mojang-api');
const Discord = require("discord.js");
const hypixelfunctions = require('../hypixelfunctions.js');


exports.run = (client, message, args, request) => {
    var uuid = hypixelfunctions.validatePlayer(args[0]);
    var date = new Date();
if(!uuid) {
    MojangAPI.uuidAt(uuid, date, (err, res) => {
        if (err) {
        console.log(err);
    message.channel.send("There was an error, or that account/UIID doesn't exist!");
} else {
    var uuid = res.id 
}
});
} else {
    // code here
    var embed = new Discord.RichEmbed()
    .setTitle("Click me to get the raw skin image.")
    .setImage("https://visage.surgeplay.com/full/" + uuid + "?tilt=0")
    .setThumbnail("https://visage.surgeplay.com/head/64/" + uuid + ".png")
    .setURL("https://visage.surgeplay.com/skin/" + uuid)
    message.channel.send({
        embed: embed
    });
}
}