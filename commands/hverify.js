const sql = require("sqlite");
const Discord = require("discord.js");
const request = require('request');
sql.open("./db/data.sqlite");
const MojangAPI = require('mojang-api');
const config = require('../config.json');
const hypixelfunctions = require('../hypixelfunctions.js');


exports.run = (client, message, args) => {
    const username = args[0];
    var date = new Date();
    let uuid = hypixelfunctions.validateUUID(username);
    function BOROP(e, res, data) {
        if(e) {
            console.error("Error: " + e.toString())
          }
           if (!res || res.statusCode !== 200) {
             console.error("Response error: " + res.toString());
           }
          var data = JSON.parse(data);
           if (data.Error === "User not found") {
               message.channel.send("This user didn't exist! `!hypixelverify [uuid/username]` If it doesn't work with usernames, you may have to use your uuid! If you have trouble, try this video! `https://youtu.be/hGasoRJj5Nc`");
          return;
           }
           if(!data.player.socialMedia || !data.player.socialMedia.links || !data.player.socialMedia.links.DISCORD) {
            message.channel.send("You need to open hypixel, then set your discord in the profile tool as `" + message.author.tag + "` Here's a video showing the full verification process. `https://youtu.be/hGasoRJj5Nc`");
           }
        sql.get(`SELECT * FROM hypixel WHERE discordid = "${message.author.id}"`).then(row => {
            if (!row) {
                sql.run("INSERT INTO hypixel (discordid) VALUES (?)", [message.author.id]).then(() => {
                    if(data.player.socialMedia.links.DISCORD === message.author.tag) {
                        sql.run(`UPDATE hypixel SET uuid = "${uuid}" WHERE discordid = ${message.author.id}`);
                        message.channel.send("You've been verified, congratulations!"); }
                     else {
                        message.channel.send("Try it like this! `!hypixelverify [uuid / MC Username]` :) If you have trouble, try this video! `https://youtu.be/hGasoRJj5Nc`");
                    }
          }).catch((e) => {
              console.error(e);
            sql.run("CREATE TABLE IF NOT EXISTS hypixel (discordid TEXT, uuid TEXT)").then(() => {
                sql.run("INSERT INTO hypixel (discordid) VALUES (?)", [message.author.id]);
        });
      });
    }
    else {
        if(data.player.socialMedia.links.DISCORD === message.author.tag) {
            sql.run(`UPDATE hypixel SET uuid = "${uuid}" WHERE discordid = ${message.author.id}`);
            message.channel.send("You've been verified, congratulations!"); }
         else {
            message.channel.send("Try it like this! `!hypixelverify [uuid / MC Username]` :) If you have trouble, try this video! `https://youtu.be/hGasoRJj5Nc`");
        }
    }


});
    }
    if (!username) {
        message.channel.send("Try it like this! `!hypixelverify [uuid / MC Username]` :) If you have trouble, try this video! `https://youtu.be/hGasoRJj5Nc`");
    } else {
        if (!uuid) {
            console.log("there was no uuid");
            MojangAPI.uuidAt(username, date, (err, res) => {
                if (err) {
                    console.log(err);
                    message.channel.send("There was an error, or that account/UIID doesn't exist!");
                } else {
                    uuid = res.id;
                    request.get("https://api.hypixel.net/player?key=" + config.hypixelkey + "&uuid=" + uuid, BOROP);
                    console.log("purple");
                }
            });
        } else {
            request.get("https://api.hypixel.net/player?key=" + config.hypixelkey + "&uuid=" + uuid, BOROP);
        }
    }
  }
