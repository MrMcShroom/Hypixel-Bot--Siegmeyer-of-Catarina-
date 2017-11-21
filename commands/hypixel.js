const request = require('request');
const hypixelfunctions = require('../hypixelfunctions.js');
const statistics = require('../statistics.js');
const config = require('../config.json');
const MojangAPI = require('mojang-api');


exports.run = (client, message, args, Discord,) => {
    let game = args[0];
    game = game.toLowerCase();
    const username = args[1];
    var date = new Date();
    let uuid = hypixelfunctions.validateUUID(username);
    function BOROP(e, res, data) {
        if(!e) {
            if (res && res.statusCode === 200) {
                var data = JSON.parse(data);
                if(!data) {
                    message.channel.send("This user has no stats!");
                } else {
                    console.log(uuid);
                    switch (game) {
                        case "bedwars":
                        case "bw":
                            try {
                                statistics.bedwars(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no BedWars stats!");
                                console.log(err)
                            }
                        break;
                        case "profile":
                        case "player":
                        case "general":
                        case "p":
                            try {
                                statistics.profile(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no profile!");
                                console.log(err)
                            }
                        break;
                        case "sw":
                        case "skywars":
                        case "sky-wars":
                            try {
                                statistics.skywars(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no SkyWars stats!");
                                console.log(err);
                            }
                        break;
                        case "bsg":
                        case "hungergames":
                        case "blitzsurvivalgames":
                            try {
                                statistics.hungergames(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no SkyWars stats!");
                                console.log(err);
                            }
                        break;
                        case "uhc":
                        case "uhcc":
                        case "hardcorechampions":
                            try {
                                statistics.uhc(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no UHCC stats!");
                                console.log(err);
                            }
                        break;
                        case "sc":
                        case "skyclash":
                        case "sky-clash":
                            try {
                                statistics.skyclash(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no UHCC stats!");
                                console.log(err);
                            }
                        break;
                        case "mw":
                        case "megawalls":
                        case "mega-walls":
                            try {
                                statistics.megawalls(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no SkyClash stats!");
                                console.log(err);
                            }
                        break;
                        case "smashheroes":
                        case "sh":
                        case "smash-heroes":
                            try {
                                statistics.smashheroes(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no Smash Heroes stats!");
                                console.log(err);
                            }
                        break;
                        case "murdermystery":
                        case "mm":
                        case "murder-mystery":
                            try {
                                statistics.murdermystery(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no Smash Heroes stats!");
                                console.log(err);
                            }
                        break;
                        case "warlords":
                        case "wl":
                        case "war-lords":
                        case "warlord":
                            try {
                                statistics.warlords(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no Warlords stats!");
                                console.log(err);
                            }
                        break;
                        case "qc":
                        case "quakecraft":
                        case "qcraft":
                        case "quake-craft":
                            try {
                                statistics.quakecraft(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no QuakeCraft stats!");
                                console.log(err);
                            }
                        break;
                    }
                }
            } else {
                message.channel.send("There was some sort of error. Sorry!")
            }
        } else {
            console.error("Error: " + e.toString());
            message.channel.send("There was some sort of error. Sorry!")
        }
    }
    if (!username || !game) {
        message.channel.send("Try it like this! `!hypixel [gametype] [username]` :)");
    } else {
          if(!uuid) {
            MojangAPI.uuidAt(username, date, (err, res) => {
                if (err) {
                    console.log(err);
                    message.channel.send("There was an error, or that account/UIID doesn't exist!");
                } else {
                    uuid = res.id;
                    request.get("https://api.hypixel.net/player?key=" + config.hypixelkey + "&uuid=" + uuid, BOROP);
                }
            });
        } else {
            request.get("https://api.hypixel.net/player?key=" + config.hypixelkey + "&uuid=" + uuid, BOROP);
        }
    }

}
