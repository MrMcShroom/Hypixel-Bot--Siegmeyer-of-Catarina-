// JavaScript source code
const MojangAPI = require('mojang-api');
const Discord = require("discord.js");
const hypixelfunctions = require('../hypixelfunctions.js');
const sql = require("sqlite");
sql.open("./db/data.sqlite");

exports.run = (client, message, args) => {
    let uuid = hypixelfunctions.validateUUID(args[0]);
    if (message.mentions.users.first()) {
        sql.get(`SELECT * FROM hypixel WHERE discordid ="${message.mentions.users.first().id}"`).then(row => {
            if (!row) return message.reply("This user has not linked their Minecraft account!");
            uuid = row.uuid;
            MojangAPI.profile(uuid, function(err, res) {
                if (err)
                    message.channel.send("There isn't a player for this UUID!")
                else {
                    message.channel.send(message.mentions.users.first() + "'s username is " + res.name + ".")
                }
            });
        });
    } else {
    if (!uuid) {
        sql.get(`SELECT * FROM hypixel WHERE discordid ="${message.author.id}"`).then(row => {
            if (!row) return message.reply("If you want to pull your own stats by not supplying a uuid, you need to link your discord! `!hypixelverify`, otherwise, supply a UUID");
            uuid = row.uuid;
            MojangAPI.profile(uuid, function(err, res) {
                if (err)
                    message.channel.send("There isn't a player for this UUID!")
                else {
                    message.channel.send(message.author.tag + "'s username is " + res.name + ".")
                }
            });
        });
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
}