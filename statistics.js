// JavaScript source code
const hypixelfunctions = require("./hypixelfunctions.js");
const snekfetch = require('snekfetch');
const url = require('url');
const Discord = require("discord.js");
const config = require("./config.json");
const sql = require("sqlite");
sql.open("./db/data.sqlite");

function online(lastlogin,lastlogout) {
    if(lastlogin > lastlogout) {
        return "online";
    } else {
        return "offline";
    }
}

function onlineimage(lastlogin,lastlogout) {
    if(lastlogin > lastlogout) {
        return "http://i.imgur.com/mIFTNbB.jpg";
    } else {
        return "http://i.imgur.com/COM0dZT.png";
    }
}

function lastseen(mostrecent) {
    switch (mostrecent) {
        case "BEDWARS":
        return "BedWars";
        break;
        case "SKYWARS":
        return "Skywars";
        break;
        case "HOUSING":
        return "Housing";
        break;
        case undefined:
        return "in Limbo";
        break;
        case "MURDER_MYSTERY":
        return "Murder Mystery";
        break;
        case "TRUE_COMBAT":
        return "Crazy Walls";
        break;
        case "QUAKE":
        return "Quake";
        break;
        case "WALLS":
        return "Walls";
        break;
        case "PAINTBALL":
        return "Paintball";
        break;
        case "HUNGERGAMES":
        return "Blitz Survival Games";
        break;
        case "TNTGAMES":
        return "TNT Games";
        break;
        case "VAMPIREZ":
        return "VampireZ";
        break;
        case "WALLS3":
        return "Mega Walls";
        break;
        case "ARCADE":
        return "Arcade Games";
        break;
        case "ARENA":
        return "Arena Brawl";
        break;
        case "UHC":
        return "UHC Champions";
        break;
        case "MCGO":
        return "Cops and Criminals";
        break;
        case "BATTLEGROUND":
        return "Warlords";
        break;
        case "SUPER_SMASH":
        return "Smash Heroes";
        break;
        case "GINGERBREAD":
        return "Turbo Kart Racers";
        break;
        case "SPEED_UHC":
        return "Speed UHC";
        break;
        case "LEGACY":
        return "Classic Games";
        break;
        case "SKYCLASH":
        return "SkyClash";
        break;
        case "PROTOTYPE":
        return "Prototype Games";
        break;
        case "BUILD_BATTLE":
        return "Build Battles";
        break;
        case "DUELS":
        return "Duels";
        break;
        default:
        return mostrecent;
    }
}

function zero(variable) {
    if (variable === undefined) {
        return 0;
    } else {
        return variable;
    }
}

async function long(url) {
    const {
        body
    } = await snekfetch.post('https://www.googleapis.com/urlshortener/v1/url?key=' + config.urlshortapikey).send({
        longUrl: url
    });
return `[${body.id}](${body.id})`;
}

async function socialmedia(link) {
    if (link === undefined) return "Not linked!"; //if it is undefined, return not linked
    const res = url.parse(link);
    if (res.protocol && res.hostname) { //if string is a url, execute this code
        return long(link);
    } else { //if the content is neither a link, or undefined,
        return link; // return itself
    }
}

function murdermystery(data,message,pop) {
    var embed = new Discord.RichEmbed()
    .setDescription(data.player.displayname + "'s Murder Mystery Stats")
    .addField("Murder Mystery Wins", zero(data.player.stats.MurderMystery.wins), true)
    .addBlankField(true)
    .addField("Wins Classic", zero(data.player.stats.MurderMystery.wins_MURDER_CLASSIC), true)
    .addBlankField(true)
    .addField("Wins Assassins", zero(data.player.stats.MurderMystery.wins_MURDER_ASSASINS), true)
    .addBlankField(true)
    .addField("Wins Hardcore", zero(data.player.stats.MurderMystery.wins_MURDER_HARDCORE), true)
    .addBlankField(true)
    .addField("Kills", zero(data.player.stats.MurderMystery.kills), true)
    .addField("Deaths", zero(data.player.stats.MurderMystery.deaths), true)
    .addField("Knife Kills", zero(data.player.stats.MurderMystery.knife_kills), true)
    .addField("Bow Kills", zero(data.player.stats.MurderMystery.bow_kills), true)
    .addField("Coins", zero(data.player.stats.MurderMystery.coins), true)
    .addField("Games", zero(data.player.stats.MurderMystery.games), true)
    .addField("Parkour Time", hypixelfunctions.parkourTime(data.player.parkourCompletions.MurderMystery), true)
    .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
    .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
    .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
    try {
        var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.MurderMystery);
        embed.addField("Parkour Time", parkourtime, true);
    } catch(e) {
        embed.addField("Parkour Time", "This user has not completed the parkour!", true);
    }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function warlords(data,message,pop) {
    var wlratio = data.player.stats.Battleground.wins / data.player.stats.Battleground.losses;
    var kdratio = data.player.stats.Battleground.kills / data.player.stats.Battleground.deaths;
    var karatio = data.player.stats.Battleground.assists / data.player.stats.Battleground.kills
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s Warlords Stats")
        .addField("Kills", zero(data.player.stats.Battleground.kills), true)
        .addField("Deaths", zero(data.player.stats.Battleground.deaths), true)
        .addField("KDR", kdratio.toFixed(2), true)
        .addField("Wins", zero(data.player.stats.Battleground.wins), true)
        .addField("Losses", zero(data.player.stats.Battleground.losses), true)
        .addField("WLR", wlratio.toFixed(2), true)
        .addField("Coins", zero(data.player.stats.Battleground.coins), true)
        .addField("Assists", zero(data.player.stats.Battleground.assists), true)
        .addField("Assist / Kill Ratio", karatio.toFixed(2), true)
        .addField("Total Repaired", zero(data.player.stats.Battleground.repaired), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.Battleground);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function smashheroes(data,message,pop) {
    var wlratio = data.player.stats.SuperSmash.wins / data.player.stats.SuperSmash.losses;
    var kdratio = data.player.stats.SuperSmash.kills / data.player.stats.SuperSmash.deaths;
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s Smash Heroes Stats")
        .addField("Wins Solo", zero(data.player.stats.SuperSmash.wins_normal), true) //
        .addField("Losses Solo", zero(data.player.stats.SuperSmash.losses_normal), true)
        .addField("Wins Teams", data.player.stats.SuperSmash.wins_teams + data.player.stats.SuperSmash.wins_2v2, true)
        .addField("Losses Teams", data.player.stats.SuperSmash.losses_teams + data.player.stats.SuperSmash.losses_2v2, true)
        .addField("Wins Total", zero(data.player.stats.SuperSmash.wins), true) //
        .addField("Losses Total", zero(data.player.stats.SuperSmash.losses), true)
        .addField("Kills", zero(data.player.stats.SuperSmash.kills), true)
        .addField("Deaths", zero(data.player.stats.SuperSmash.deaths), true)
        .addField("Kills Solo", zero(data.player.stats.SuperSmash.kills_normal), true)
        .addField("Deaths Solo", zero(data.player.stats.SuperSmash.deaths_normal), true)
        .addField("Kills Teams", data.player.stats.SuperSmash.kills_teams + data.player.stats.SuperSmash.kills_2v2, true)
        .addField("Deaths Teams", data.player.stats.SuperSmash.deaths_teams + data.player.stats.SuperSmash.deaths_2v2, true)
        .addField("W/L Ratio", wlratio.toFixed(2), true)
        .addField("K/D Ratio", kdratio.toFixed(2), true)
        .addField("Active Hero", data.player.stats.SuperSmash.active_class, true)
        .addField("Smash Level", zero(data.player.stats.SuperSmash.smashLevel), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.SuperSmash);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function skyclash(data,message,pop) {
    var wlratio = data.player.stats.SkyClash.team_war_wins / data.player.stats.SkyClash.losses;
    var kdratio = data.player.stats.SkyClash.kills / data.player.stats.SkyClash.deaths;
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s SkyClash Stats")
        .addField("Coins", zero(data.player.stats.SkyClash.coins), true)
        .addField("K/D", kdratio.toFixed(2), true)
        .addField("Wins", zero(data.player.stats.SkyClash.wins), true)
        .addField("Losses", zero(data.player.stats.SkyClash.losses), true)
        .addField("Solo Wins", zero(data.player.stats.SkyClash.solo_wins), true)
        .addField("Solo Losses", zero(data.player.stats.SkyClash.losses_solo), true)
        .addField("Doubles Wins", zero(data.player.stats.SkyClash.doubles_wins), true)
        .addField("Doubles Losses", zero(data.player.stats.SkyClash.losses_doubles), true)
        .addField("Team War Wins", zero(data.player.stats.SkyClash.team_war_wins), true)
        .addField("Team War Losses", zero(data.player.stats.SkyClash.losses_team_war), true)
        .addField("Solo Kills", zero(data.player.stats.SkyClash.kills_solo), true)
        .addField("Solo Deaths", zero(data.player.stats.SkyClash.deaths_solo), true)
        .addField("Doubles Kills", zero(data.player.stats.SkyClash.kills_doubles), true)
        .addField("Doubles Deaths", zero(data.player.stats.SkyClash.deaths_doubles), true)
        .addField("Team War Kills", zero(data.player.stats.SkyClash.kills_team_war), true)
        .addField("Team War Deaths", zero(data.player.stats.SkyClash.deaths_team_war), true)
        .addField("Mobs Spawned", zero(data.player.stats.SkyClash.mobs_spawned), true)
        .addField("W/L", wlratio.toFixed(2), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.SkyClash);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function megawalls(data,message,pop) {
    var wlratio = data.player.stats.Walls3.wins / data.player.stats.Walls3.losses;
    var kdratio = data.player.stats.Walls3.kills / data.player.stats.Walls3.deaths;
    var fkdratio = data.player.stats.Walls3.finalKills / data.player.stats.Walls3.finalDeaths;
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s MegaWalls Stats")
        .addField("Coins", zero(data.player.stats.Walls3.coins), true)
        .addField("K/D", kdratio.toFixed(2), true)
        .addField("Wins", zero(data.player.stats.Walls3.wins), true)
        .addField("Losses", zero(data.player.stats.Walls3.losses), true)
        .addField("Kills", zero(data.player.stats.Walls3.losses), true)
        .addField("Deaths", zero(data.player.stats.Walls3.losses), true)
        .addField("Assists", zero(data.player.stats.Walls3.assists), true)
        .addField("Final Assists", zero(data.player.stats.Walls3.finalAssists), true)
        .addField("Final Kills", zero(data.player.stats.Walls3.finalKills), true)
        .addField("Final Deaths", zero(data.player.stats.Walls3.finalDeaths), true)
        .addField("Final KDR", zero(fkdratio.toFixed(2)), true)
        .addField("WLR", zero(wlratio.toFixed(2)), true)
        .addField("Selected Class", data.player.stats.Walls3.chosen_class, true)
        .addField("Wither Damage", zero(data.player.stats.Walls3.wither_damage), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.Walls3);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function hungergames(data,message,pop) {
    var wlratio = data.player.stats.HungerGames.wins / data.player.stats.HungerGames.losses;
    var kdratio = data.player.stats.HungerGames.kills / data.player.stats.HungerGames.deaths;
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s Blitz Survival Games Stats")
        .addField("Coins", zero(data.player.stats.HungerGames.coins), true)
        .addField("Kills", zero(data.player.stats.HungerGames.kills), true)
        .addField("Solo Wins", zero(data.player.stats.HungerGames.wins), true)
        .addField("Team Wins", zero(data.player.stats.HungerGames.wins_teams + data.player.stats.HungerGames.wins), true)
        .addField("KDR", kdratio.toFixed(2), true)
        .addField("WLR", wlratio.toFixed(2), true)
        .addField("Default Kit", zero(data.player.stats.HungerGames.defaultkit), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.HungerGames);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function uhc(data,message,pop) {
    var wlratio = data.player.stats.UHC.wins / data.player.stats.UHC.losses;
    var kdsoloratio = data.player.stats.UHC.kills_solo / data.player.stats.UHC.deaths_solo;
    teamdeaths = data.player.stats.UHC.deaths;
    teamkills = data.player.stats.UHC.kills;
    teamwins = data.player.stats.UHC.wins;
    var kdteamratio = teamkills / teamdeaths;
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s UHC Champions Stats")
        .addField("Coins", zero(data.player.stats.UHC.coins), true)
        .addField("Score", zero(data.player.stats.UHC.score), true)
        .addField("Solo Kills", zero(data.player.stats.UHC.kills_solo), true)
        .addField("Solo Wins", zero(data.player.stats.UHC.wins_solo), true)
        .addField("Teams Kills", zero(teamkills), true)
        .addField("Teams Wins", zero(teamwins), true)
        .addField("KDR Solo", kdsoloratio.toFixed(2), true)
        .addField("KDR Teams", kdteamratio.toFixed(2), true)
        .addField("Equipped Kit", zero(data.player.stats.UHC.equippedKit), true)
        .addField("Overall WLR", wlratio.toFixed(2), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.UHC);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function profilenosocial(data,message,pop) {
    var embed = new Discord.RichEmbed()
    .setDescription(data.player.displayname + "'s Hypixel Profile")
    .addField("Network Level", hypixelfunctions.getTrueLevel(data.player.networkExp || 0, data.player.networkLevel || 0), true)
    .addField("Network Exp", data.player.networkExp, true)
    .addField("Karma", data.player.karma, true)
    .addField("Rank", hypixelfunctions.rank(data.player.rank, data.player.newPackageRank, pop, data.player.packageRank,data.player.monthlyPackageRank), true)
    .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
    .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
    .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
    sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
    message.channel.send(data.player.displayname + " has not linked any social media, so their profile is shortened! (Try getting on hypixel, using the 'My Profile' Tool, then going to the 'Social Media' Section :)");
}

function skywars(data,message,pop) {
    
    var embed = new Discord.RichEmbed()
    .setDescription(data.player.displayname + "'s Skywars Stats")
    .addField("Wins", zero(data.player.stats.SkyWars.wins), true)
    .addField("Losses", zero(data.player.stats.SkyWars.losses), true)
    .addField("Teams Insane Wins", zero(data.player.stats.SkyWars.wins_team_insane), true)
    .addField("Teams Normal Wins", zero(data.player.stats.SkyWars.wins_team_normal), true)
    .addField("Teams Insane Losses", zero(data.player.stats.SkyWars.losses_team_insane), true)
    .addField("Teams Normal Losses", zero(data.player.stats.SkyWars.losses_team_normal), true)
    .addField("Solo Insane Wins", zero(data.player.stats.SkyWars.wins_solo_insane), true)
    .addField("Solo Normal Wins", zero(data.player.stats.SkyWars.wins_solo_normal), true)
    .addField("Solo Insane Losses", zero(data.player.stats.SkyWars.losses_solo_insane), true)
    .addField("Solo Normal Losses", zero(data.player.stats.SkyWars.losses_solo_normal), true)
    .addField("Teams Insane Kills", zero(data.player.stats.SkyWars.kills_team_insane), true)
    .addField("Teams Normal Kills", zero(data.player.stats.SkyWars.kills_team_normal), true)
    .addField("Teams Insane Deaths", zero(data.player.stats.SkyWars.deaths_team_insane), true)
    .addField("Teams Normal Deaths", zero(data.player.stats.SkyWars.deaths_team_normal), true)
    .addField("Solo Insane Kills", zero(data.player.stats.SkyWars.kills_solo_insane), true)
    .addField("Solo Normal Kills", zero(data.player.stats.SkyWars.kills_solo_normal), true)
    .addField("Solo Insane Deaths", zero(data.player.stats.SkyWars.deaths_solo_insane), true)
    .addField("Solo Normal Deaths", zero(data.player.stats.SkyWars.deaths_solo_normal), true)
    .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
    .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
    .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
    try {
        var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.SkyWars);
        embed.addField("Parkour Time", parkourtime, true);
    } catch(e) {
        embed.addField("Parkour Time", "This user has not completed the parkour!", true);
    }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function bedwars(data,message,pop) {
    var wlratio = data.player.stats.Bedwars.wins_bedwars / data.player.stats.Bedwars.losses_bedwars;
    var kdratio = data.player.stats.Bedwars.final_kills_bedwars / data.player.stats.Bedwars.final_deaths_bedwars;
    var kill = zero(data.player.stats.Bedwars.final_kills_bedwars + data.player.stats.Bedwars.kills_bedwars);
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s Bedwars Stats")
        .addField("BedWars Wins", zero(data.player.stats.Bedwars.wins_bedwars), true)
        .addField("BedWars Losses", zero(data.player.stats.Bedwars.losses_bedwars), true)
        .addField("BedWars Kills", kill, true)
        .addField("BedWars Deaths", zero(data.player.stats.Bedwars.deaths_bedwars), true)
        .addField("BedWars Level", data.player.achievements.bedwars_level, true)
        .addField("BedWars Winstreak", zero(data.player.stats.Bedwars.winstreak), true)
        .addField("BedWars Solo Wins", zero(data.player.stats.Bedwars.eight_one_wins_bedwars), true)
        .addField("BedWars Solo Losses", zero(data.player.stats.Bedwars.eight_one_losses_bedwars), true)
        .addField("BedWars Doubles Wins", zero(data.player.stats.Bedwars.eight_two_wins_bedwars), true)
        .addField("BedWars Doubles Losses", zero(data.player.stats.Bedwars.eight_two_losses_bedwars), true)
        .addField("BedWars Triples Wins", zero(data.player.stats.Bedwars.four_three_wins_bedwars), true)
        .addField("BedWars Triples Losses", zero(data.player.stats.Bedwars.four_three_losses_bedwars), true)
        .addField("BedWars Fours Wins", zero(data.player.stats.Bedwars.four_four_wins_bedwars), true)
        .addField("BedWars Fours Losses", zero(data.player.stats.Bedwars.four_four_losses_bedwars), true)
        .addField("BedWars Final Kills", zero(data.player.stats.Bedwars.final_kills_bedwars), true)
        .addField("BedWars Final Deaths", zero(data.player.stats.Bedwars.final_deaths_bedwars), true)
        .addField("WLR", wlratio.toFixed(2), true)
        .addField("Final KDR", kdratio.toFixed(2), true)
        .addField("Bed Destroyed", zero(data.player.stats.Bedwars.beds_broken_bedwars), true)
        .addField("Beds Lost", zero(data.player.stats.Bedwars.beds_lost_bedwars), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.Bedwars);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function buildbattle(data,message,pop) {
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s Build Battle Stats")
        .addField("Wins", zero(data.player.stats.BuildBattle.wins), true)
        .addField("Solo Wins", zero(data.player.stats.BuildBattle.wins_solo_normal), true)
        .addField("Score", zero(data.player.stats.BuildBattle.score), true)
        .addField("Total Coins", zero(data.player.stats.BuildBattle.coins), true)
        .addField("Correct Guesses", zero(data.player.stats.BuildBattle.correct_guesses), true)
        .addField("Monthly Coins", zero(data.player.stats.BuildBattle.monthly_coins_a), true)
        .addField("Weekly Coins", zero(data.player.stats.BuildBattle.weekly_coins_a), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.BuildBattle);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function duels(data,message,pop) {
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s Duels Stats")
        .addField("Classic Duels Winstreak", zero(data.player.stats.Duels.duels_winstreak_classic_duel), true)
        .addField("Classic Duels Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_classic_duel), true)
        .addField("Combo Duels Winstreak", zero(data.player.stats.Duels.duels_winstreak_combo_duel), true)
        .addField("Combo Duels Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_combo_duel), true)
        .addField("Bow Duels Winstreak", zero(data.player.stats.Duels.duels_winstreak_bow_duel), true)
        .addField("Bow Duels Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_bow_duel), true)
        .addField("OP Duels Winstreak", zero(data.player.stats.Duels.duels_winstreak_op_duel), true)
        .addField("OP Duels Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_OP_duel), true)
        .addField("Potion Duels Winstreak", zero(data.player.stats.Duels.duels_winstreak_potion_duel), true)
        .addField("Potion Duels Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_potion_duel), true)
        .addField("Skywars Duels Winstreak", zero(data.player.stats.Duels.duels_winstreak_sw_duel), true)
        .addField("Skywars Duels Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_sw_duel), true)
        .addField("Skywars Doubles Winstreak", zero(data.player.stats.Duels.duels_winstreak_sw_duel), true)
        .addField("Skywars Doubles Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_sw_doubles), true)
        .addField("UHC Duels Winstreak", zero(data.player.stats.Duels.duels_winstreak_uhc_duel), true)
        .addField("UHC Duels Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_uhc_duel), true)
        .addField("UHC Doubles Winstreak", zero(data.player.stats.Duels.duels_winstreak_uhc_doubles), true)
        .addField("UHC Doubles Best Winstreak", zero(data.player.stats.Duels.duels_winstreak_best_uhc_doubles), true)
        .addField("Total Duels", zero(data.player.stats.Duels.games_played_duels), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.Prototype);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
                      sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

async function profilesocialmedia(data,message,pop) {
    const youtube = await socialmedia(data.player.socialMedia.links.YOUTUBE);
    const twitch = await socialmedia(data.player.socialMedia.links.TWITCH);
    const twitter = await socialmedia(data.player.socialMedia.links.TWITTER);
    const instagram = await socialmedia(data.player.socialMedia.links.INSTAGRAM);
    const mixer = await socialmedia(data.player.socialMedia.links.MIXER);
    const discrd = await socialmedia(data.player.socialMedia.links.DISCORD);
    const forums = await socialmedia(data.player.socialMedia.links.HYPIXEL);
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s Hypixel Profile")
        .addField("Network Level", hypixelfunctions.getTrueLevel(data.player.networkExp || 0, data.player.networkLevel || 0), true)
        .addField("Network Exp", data.player.networkExp, true)
        .addField("Karma", data.player.karma, true)
        .addField("Rank", hypixelfunctions.rank(data.player.rank, data.player.newPackageRank, pop, data.player.packageRank,data.player.monthlyPackageRank), true)
        .addField("Youtube", youtube, true)
        .addField("Twitter", twitter, true)
        .addField("Instagram", instagram, true)
        .addField("Twitch", twitch, true)
        .addField("Mixer", mixer, true)
        .addField("Discord", discrd, true)
        .addField("Hypixel Forums", forums, true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function profile(data,message,pop) {
    if(data.player.socialMedia && data.player.socialMedia.links) {
        profilesocialmedia(data,message,pop);
    } else {
        profilenosocial(data,message,pop);
    }


}

function quakecraft(data,message,pop) {
    var teamkd = zero(data.player.stats.Quake.kills_teams) / zero(data.player.stats.Quake.deaths_teams);
    var overallkills = zero(data.player.stats.Quake.kills) + zero(data.player.stats.Quake.kills_teams);
    var overalldeaths = zero(data.player.stats.Quake.deaths) + zero(data.player.stats.Quake.deaths_teams);
    var finalkd = overallkills / overalldeaths;
    var solokd = zero(data.player.stats.Quake.kills) / zero(data.player.stats.Quake.deaths);
    var embed = new Discord.RichEmbed()
            .setDescription(data.player.displayname + "'s Quakecraft Stats")
            .addField("Quake Solo Wins", zero(data.player.stats.Quake.wins), true)
            .addField("Quake Solo Kills", zero(data.player.stats.Quake.kills), true)
            .addField("Quake Solo Deaths", zero(data.player.stats.Quake.deaths), true)
            .addField("Quake Solo Killstreaks", zero(data.player.stats.Quake.killstreaks), true)
            .addField("Quake Solo K/D", solokd.toFixed(2), true)
            .addField("Quake Team Wins", zero(data.player.stats.Quake.wins_teams), true)
            .addField("Quake Team Kills", zero(data.player.stats.Quake.kills_teams), true)
            .addField("Quake Team Deaths", zero(data.player.stats.Quake.deaths_teams), true)
            .addField("Quake Team Killstreaks", zero(data.player.stats.Quake.killstreaks_teams), true)
            .addField("Quake Team K/D", teamkd.toFixed(2), true)
            .addField("Quake Final K/D", finalkd.toFixed(2), true)
            .addField("Parkour Time", hypixelfunctions.parkourTime(data.player.parkourCompletions.Quake), true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank, data.player.monthlyPackageRank))
        .setFooter(data.player.displayname + " is " + online(data.player.lastLogin,data.player.lastLogout) + ", and was last seen playing " + lastseen(data.player.mostRecentGameType), onlineimage(data.player.lastLogin,data.player.lastLogout))
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        try {
            var parkourtime = hypixelfunctions.parkourTime(data.player.parkourCompletions.Quake);
            embed.addField("Parkour Time", parkourtime, true);
        } catch(e) {
            embed.addField("Parkour Time", "This user has not completed the parkour!", true);
        }
        sql.get(`SELECT * FROM hypixel WHERE uuid ="${pop}" AND discordid IS NOT NULL`).then(row => {                     if (!row) return message.channel.send({embed:embed});                     message.client.fetchUser(row.discordid).then(discorduser => {                     embed.setAuthor(discorduser.tag,discorduser.avatarURL);                     message.channel.send({embed:embed});                     });                   });
}

function help(message) {
    var embed = new Discord.RichEmbed()
            .setTitle(config.botname + "'s Hypixel Command Help")
            .setDescription("Hello, and thanks for using Siegmeyer! While looking, you should note that in the examples, anywhere you see a player name, you can replace that with a UUID, and a discord mention if the player has verified themselves via `!hypixelverify` command. Also, a lot of the games will work with their acronyms, such as `bw` instead of `bedwars` and other things.")
            .addField("Profile", "`!hypixel profile mrmcshroom`", true)
            .addField("Bedwars", "`!hypixel bedwars mrmcshroom`", true)
            .addField("Skywars", "`!hypixel skywars mrmcshroom`", true)
            .addField("UHC", "`!hypixel UHC plancke`", true)
            .addField("Smash Heroes", "`!hypixel smashheroes plancke`", true)
            .addField("SkyClash", "`!hypixel skyclash plancke`", true)
            .addField("Quakecraft", "`!hypixel quake plancke`", true)
            .addField("Warlords", "`!hypixel warlords plancke`", true)
            .addField("Murder Mystery", "`!hypixel mm plancke`", true)
            .addField("MegaWalls", "`!hypixel megawalls plancke`", true)
            .addField("Blitz Survival Games", "`!hypixel bsg plancke`", true)
            .addField("Build Battle", "`!hypixel bb plancke`", true)
            .addField("Duels", "`!hypixel duels kabanov`", true)
            .addField("Guild", "`!hypixel guild plancke`", true)
            .addField("Help command", "`!help`", true)
            .addField("Hypixel Verify (For @mention commands)", "`!hypixelverify mrmcshroom`", true)
            .addField("Suggestion command", "`!suggest Make the bot better`", true)
        .setColor("0xFFFFFF")
        .setFooter("Message delivered with love from " + config.botname)
        .setThumbnail(message.client.user.avatarURL)
        console.log("Displaying help command for hypixel");
        message.channel.send({embed:embed});
}

function guilddata(data,message,pop) {
        var creationdate = new Date(data.guild.created);
        var embed = new Discord.RichEmbed()
        .setTitle(data.guild.name + " Guild Profile")
        .setThumbnail("https://hypixel.net/data/guild_banners/100x200/" + data.guild._id + ".png")
        .addField("Max Daily Coins", 10000 + data.guild.bankSizeLevel * 1000, true)
        .addField("Coins", data.guild.coins, true)
        .addField("Coins Ever", data.guild.coinsEver, true)
        .addField("Creation Date", creationdate.toUTCString(), true)
        .addField("MVPs", data.guild.mvpCount, true)
        .addField("VIPs", data.guild.vipCount, true)
        message.channel.send({embed:embed});
}

module.exports = {
    profilesocialmedia,
    bedwars,
    skywars,
    profilenosocial,
    uhc,
    hungergames,
    megawalls,
    skyclash,
    smashheroes,
    warlords,
    murdermystery,
    quakecraft,
    profile,
    guilddata,
    buildbattle,
    duels,
    help
};