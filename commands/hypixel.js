const request = require('request');
const hypixelfunctions = require('../hypixelfunctions.js');
const statistics = require('../statistics.js');
const config = require('../config.json');
const MojangAPI = require('mojang-api');
const sql = require("sqlite");
const Discord = require("discord.js");
sql.open("./db/data.sqlite");

function statisticallogging(uuid,level,fkdr,wlr) {
    sql.get(`SELECT * FROM hypixel WHERE uuid ="${uuid}"`).then(row => {
        if (!row) sql.run("INSERT INTO hypixel (uuid,level,fkdr,wlr) VALUES (?,?,?,?)", [uuid,level,fkdr,wlr]) 
        sql.run(`UPDATE hypixel SET level ="${level}" WHERE uuid ="${uuid}"`);
        sql.run(`UPDATE hypixel SET fkdr ="${fkdr}" WHERE uuid ="${uuid}"`);
        sql.run(`UPDATE hypixel SET wlr ="${wlr}" WHERE uuid ="${uuid}"`);
      });
}

exports.run = (client, message, args) => {
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
    var colors = ["0x67037b","0xff2492","0x1e90ff","0xc71585","0x7fff00","0xdc143c","0x48d1cc","0x9932cc"]
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
    var embed = new Discord.RichEmbed();
    embed.setTitle("Loading the requested stats!")
    .setDescription("Be patient, the Hypixel API is working hard :)")
    .setColor(colors[Math.floor(Math.random() * colors.length)])
    .setThumbnail("https://i.imgur.com/Den5IAV.png")
    .setFooter("Loading stats with love from the Hypixel API.", message.client.user.avatarURL)
    function requestguildid(guildid) {
        if(typeof guildid === 'string') {
            request.get("https://api.hypixel.net/guild?key=" + config.hypixelkey + "&id=" + guildid, function(e, res, data) {
                if(!e) {
                  if (res && res.statusCode === 200) {
                      data = JSON.parse(data);
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
        message.channel.send({embed:embed}).then((oldembed) => {
        if(!e) {
            if (res && res.statusCode === 200) {
                let parseddata = JSON.parse(data);
                if(!parseddata) {
                    message.channel.send("This user has no stats! Try `!hypixel help`!");
                } else {
                    switch (game) {
                        case "bedwars":
                        case "bw":
                            try {
                                var wlratio = parseddata.player.stats.Bedwars.wins_bedwars / parseddata.player.stats.Bedwars.losses_bedwars;
                                var kdratio = parseddata.player.stats.Bedwars.final_kills_bedwars / parseddata.player.stats.Bedwars.final_deaths_bedwars;
                                statistics.bedwars(parseddata,message,uuid,oldembed);
                                statisticallogging(uuid,parseddata.player.achievements.bedwars_level,kdratio,wlratio);
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
                                statistics.profile(parseddata,message,uuid,oldembed);
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
                                statistics.skywars(parseddata,message,uuid,oldembed);
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
                                statistics.hungergames(parseddata,message,uuid,oldembed);
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
                                statistics.uhc(parseddata,message,uuid,oldembed);
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
                                statistics.skyclash(parseddata,message,uuid,oldembed);
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
                                statistics.megawalls(parseddata,message,uuid,oldembed);
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
                                statistics.smashheroes(parseddata,message,uuid,oldembed);
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
                                statistics.murdermystery(parseddata,message,uuid,oldembed);
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
                                statistics.warlords(parseddata,message,uuid,oldembed);
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
                                statistics.quakecraft(parseddata,message,uuid,oldembed);
                            }
                            catch(err) {
                                message.channel.send("This player has no QuakeCraft stats! Try `!hypixel help`!");
                                console.log(err);
                            }
                        break;
                        case "duels":
                        case "d":
                            try {
                                statistics.duels(parseddata,message,uuid,oldembed);
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
                                statistics.buildbattle(parseddata,message,uuid,oldembed);
                            }
                            catch(err) {
                                message.channel.send("This player has no Build Battle stats! Try `!hypixel help`!");
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
    });
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
