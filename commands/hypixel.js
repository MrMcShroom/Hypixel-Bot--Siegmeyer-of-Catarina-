const request = require('request');
const hypixelfunctions = require('../hypixelfunctions.js');
const statistics = require('../statistics.js');
const config = require('../config.json');
const MojangAPI = require('mojang-api');
const sql = require("sqlite");
sql.open("./db/data.sqlite");


exports.run = (client, message, args, Discord,) => {
    sql.run("CREATE TABLE IF NOT EXISTS hypixel (discordid TEXT, uuid TEXT)");
    function commandtype(game) {
        switch (game) {
            case "guild":
            return "guild";
            break;
            case "guildof":
            case "playerguild":
            return "player";
            break;
            case "guildid":
            return "guild";
            break;
            default:
            return "player";
        }
    }
    let game = args[0];
    const doesneeduuid = commandtype(game);
    try {
    game = game.toLowerCase();
    } catch(e) {

    }
    const username = args[1];
    var date = new Date();
    let uuid = hypixelfunctions.validateUUID(username);
    console.log("Attempting to display " + username + "'s " + game + " info. Message sent by " + message.author.tag);
    function requestguildid(guildid) {
        console.log("https://api.hypixel.net/guild?key=" + config.hypixelkey + "&id=" + guildid);
        if(typeof guildid === 'string') {
            request.get("https://api.hypixel.net/guild?key=" + config.hypixelkey + "&id=" + guildid, function(e, res, data) {
                if(!e) {
                  if (res && res.statusCode === 200) {
                      data = JSON.parse(data);
                      console.log(data.success);
                    if(data.guild) {
                        statistics.guilddata(data,message,uuid);
                    } else {
                        return message.channel.send("There is no guild under this name! To be sure, we also tested for a guild for this player, and didn't find one!");
                    }
                  } else {
                    console.error("Response error: " + res.toString());
                  }
                } else {
                  console.error("Error: " + e.toString())
                }
              });
        } else {
            return;
        } 
    }
    function guildfind(e, res, data) {
        var guildid;
        if(!e) {
            if (res && res.statusCode === 200) {
                data = JSON.parse(data);
                if(data.guild) {
                    guildid = data.guild; 
                    requestguildid(guildid);
                } else if(data.guild === null) {
                    MojangAPI.uuidAt(username, date, (err, res) => {
                        if (err) {
                            console.log(err);
                            message.channel.send("There was an error, or that account/UIID doesn't exist! Try `!hypixel help`!");
                        } else {
                            uuid = res.id;
                        }
                     request.get("https://api.hypixel.net/findGuild?key=" + config.hypixelkey + "&byUuid=" + uuid, function(e, res, data) {
                        if(!e) {
                          if (res && res.statusCode === 200) {
                              data = JSON.parse(data);
                            if(data.guild) {
                                requestguildid(data.guild);
                            } else {
                                message.channel.send("There is no guild under this name! To be sure, we also tested for a guild for this player, and didn't find one!");
                            }
                          } else {
                            console.error("Response error: " + res.toString());
                          }
                        } else {
                          console.error("Error: " + e.toString())
                        }
                      });
                    });
                } else {
                    message.channel.send("There is no guild for this player!");
                    return;
                }
            } else {
                message.channel.send("There was some sort of error. Sorry! Try `!hypixel help`!")
            }
        } else {
            console.error("Error: " + e.toString());
            message.channel.send("There was some sort of error. Sorry! Try `!hypixel help`!")
        }
    }
    function BOROP(e, res, data) {
        if(!e) {
            if (res && res.statusCode === 200) {
                var data = JSON.parse(data);
                if(!data) {
                    message.channel.send("This user has no stats! Try `!hypixel help`!");
                } else {
                    switch (game) {
                        case "bedwars":
                        case "bw":
                            try {
                                statistics.bedwars(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no BedWars stats! Try `!hypixel help`!");
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
                                message.channel.send("This player has no profile! Try `!hypixel help`!");
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
                                message.channel.send("This player has no SkyWars stats! Try `!hypixel help`!");
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
                                message.channel.send("This player has no Blitz Survival Games stats! Try `!hypixel help`!");
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
                                message.channel.send("This player has no UHCC stats! Try `!hypixel help`!");
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
                                message.channel.send("This player has no SkyClash stats! Try `!hypixel help`!");
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
                                message.channel.send("This player has no MegaWalls stats! Try `!hypixel help`!");
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
                                message.channel.send("This player has no Smash Heroes stats! Try `!hypixel help`!");
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
                                message.channel.send("This player has no MurderMystery stats! Try `!hypixel help`!");
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
                                message.channel.send("This player has no Warlords stats! Try `!hypixel help`!");
                                console.log(err);
                            }
                        break;
                        case "qc":
                        case "quakecraft":
                        case "qcraft":
                        case "quake-craft":
                        case "quake":
                            try {
                                statistics.quakecraft(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no QuakeCraft stats! Try `!hypixel help`!");
                                console.log(err);
                            }
                        break;
                        break;
                        case "duels":
                        case "d":
                            try {
                                statistics.duels(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no Duels stats! Try `!hypixel help`!");
                                console.log(err);
                            }
                        break;
                        case "bb":
                        case "build":
                        case "buildbattle":
                        case "battlebuild":
                        case "":
                            try {
                                statistics.buildbattle(data,message,uuid);
                            }
                            catch(err) {
                                message.channel.send("This player has no Build Battle stats! Try `!hypixel help`!");
                                console.log(err);
                            }
                        break;
                        case "help":
                        try {
                            statistics.help(message);
                        }
                        catch(err) {
                            message.channel.send("There was an error, sorry! Try `!hypixel help`!");
                            console.log(err);
                        }
                break;
                    }
                }
            } else {
                message.channel.send("There was some sort of error. Sorry! Try `!hypixel help`!")
            }
        } else {
            console.error("Error: " + e.toString());
            message.channel.send("There was some sort of error. Sorry! Try `!hypixel help`!")
        }
    }
    function guildorstats(game,username,uuid) {
        var requesttype;
        var guildname;
        var parameter;
        var guildid;
        if(game === "guild" || game ===  "guildof" || game ===   "playerguild" || game ===   "guildid") {
            switch (game) {
                case "guild":
                if(args.length > 2) {
                    guildname = args.slice(1);
                    username = guildname.join("%20");
                    }
                requesttype = "&byName=";
                parameter = username;
                console.log("Type: " + requesttype + " Parameter: " + parameter);
                break;
                case "guildof":
                case "playerguild":
                requesttype = "&byUuid=";
                parameter = uuid;
                break;
                case "guildid":
                requesttype = "done";
                guildid = username;
                break;
            }
            if(requesttype === "done") {  
                requestguildid(guildid);
            } else {
                guildid = request.get("https://api.hypixel.net/findGuild?key=" + config.hypixelkey + requesttype + parameter, guildfind);
            }
        } else {
            request.get("https://api.hypixel.net/player?key=" + config.hypixelkey + "&uuid=" + uuid, BOROP);
            console.log("https://api.hypixel.net/player?key=" + config.hypixelkey + "&uuid=" + uuid)            
        }
    }
    if (!username || !game) {
        if(game === "help") {
               return statistics.help(message);
        }
         if (!args[1] && args[0]) {
            sql.get(`SELECT * FROM hypixel WHERE discordid ="${message.author.id}"`).then(row => {
              if (!row || !row.uuid) return message.reply("If you want to pull your own stats by not supplying a user, you need to link your discord! `!hypixelverify`");
              uuid = row.uuid;
              guildorstats(game,username,uuid);
              console.log("This hypixel command lacked a username argument. Attempting to pull stats for " + message.author.id);
            });
        } else {
            message.channel.send("Try it like this! `!hypixel [gametype] [username]` :) Or try `!hypixel help`!");
        }
    } else {
        if (message.mentions.users.first()) {
            sql.get(`SELECT * FROM hypixel WHERE discordid ="${message.mentions.users.first().id}"`).then(row => {
                if (!row || !row.uuid) return message.reply("This user has not linked their Minecraft account! Try `!hypixel help`!");
                uuid = row.uuid;
                guildorstats(game,username,uuid);
                console.log("This was command used a discord mention");
              });
            }
         else if(!uuid && doesneeduuid === "player") {
            MojangAPI.uuidAt(username, date, (err, res) => {
                if (err) {
                    console.log(err);
                    message.channel.send("There was an error, or that account/UIID doesn't exist! Try `!hypixel help`!");
                } else {
                    uuid = res.id;
                    guildorstats(game,username,uuid);
                }
            });
        } else {
            guildorstats(game,username,uuid);
        }
    }

}
