// JavaScript source code
const MojangAPI = require('mojang-api');
const Discord = require("discord.js");
const hypixelfunctions = require('../hypixelfunctions.js');
exports.run = (client, message, args) => {
    const uuid = hypixelfunctions.validateUUID(args[0]);
    if (!uuid) {
        message.channel.send("This isn't a valid UUID! `!username [UUID]`");
    } else {
        MojangAPI.profile(uuid, function(err, res) {
            if (err)
                message.channel.send("There isn't a player for this UUID!")
            else {
                message.channel.send(res.id + "'s username is " + res.name + ".")
            }
        });
    }

}