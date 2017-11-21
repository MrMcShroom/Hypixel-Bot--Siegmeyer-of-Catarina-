// JavaScript source code
const hypixelfunctions = require("./hypixelfunctions.js")
const snekfetch = require('snekfetch');
const url = require('url');
const Discord = require("discord.js");
const config = require("./config.json");
const sql = require("sqlite");
sql.open("./db/data.sqlite");



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
    .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
    .setFooter("Pulled with love from the Hypixel API by " + config.botname)
    .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
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
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
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
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
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
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
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
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
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
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
}

function uhc(data,message,pop) {
    var wlratio = data.player.stats.UHC.wins / data.player.stats.UHC.losses;
    var kdsoloratio = data.player.stats.UHC.kills_solo / data.player.stats.UHC.deaths_solo;
    teamdeaths = data.player.stats.UHC.deaths - data.player.stats.UHC.deaths_solo;
    teamkills = data.player.stats.UHC.kills - data.player.stats.UHC.kills_solo;
    teamwins = data.player.stats.UHC.wins - data.player.stats.UHC.wins_solo;
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
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
}

function profilenosocial(data,message,pop) {
    var embed = new Discord.RichEmbed()
    .setDescription(data.player.displayname + "'s Hypixel Profile")
    .addField("Network Level", hypixelfunctions.getTrueLevel(data.player.networkExp || 0, data.player.networkLevel || 0), true)
    .addField("Network Exp", data.player.networkExp, true)
    .addField("Karma", data.player.karma, true)
    .addField("Rank", hypixelfunctions.rank(data.player.rank, data.player.newPackageRank, pop, data.player.packageRank), true)
    .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
    .setFooter("Pulled with love from the Hypixel API by " + config.botname)
    .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
    message.channel.send({embed:embed});
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
    .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
    .setFooter("Pulled with love from the Hypixel API by " + config.botname)
    .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
}

function bedwars(data,message,pop) {
    var wlratio = data.player.stats.Bedwars.wins_bedwars / data.player.stats.Bedwars.losses_bedwars;
    var kdratio = data.player.stats.Bedwars.final_kills_bedwars / data.player.stats.Bedwars.final_deaths_bedwars;
    var embed = new Discord.RichEmbed()
        .setDescription(data.player.displayname + "'s Bedwars Stats")
        .addField("BedWars Wins", zero(data.player.stats.Bedwars.wins_bedwars), true)
        .addField("BedWars Losses", zero(data.player.stats.Bedwars.losses_bedwars), true)
        .addField("BedWars Kills", zero(data.player.stats.Bedwars.kills_bedwars), true)
        .addField("BedWars Deaths", zero(data.player.stats.Bedwars.deaths_bedwars), true)
        .addField("BedWars Level", hypixelfunctions.getBedwarsLevel(data.player.stats.Bedwars.Experience).toFixed(2), true)
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
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
                      message.channel.send({embed:embed});
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
        .addField("Rank", hypixelfunctions.rank(data.player.rank, data.player.newPackageRank, pop, data.player.packageRank), true)
        .addField("Youtube", youtube, true)
        .addField("Twitter", twitter, true)
        .addField("Instagram", instagram, true)
        .addField("Twitch", twitch, true)
        .addField("Mixer", mixer, true)
        .addField("Discord", discrd, true)
        .addField("Hypixel Forums", forums, true)
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
        message.channel.send({embed:embed});
}

function profile(data,message,pop) {
    if(data.player.socialMedia) {
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
        .setColor(hypixelfunctions.getrankcolor(data.player.newPackageRank, data.player.rank, data.player.rankPlusColor, pop, data.player.packageRank))
        .setFooter("Pulled with love from the Hypixel API by " + config.botname)
        .setThumbnail("https://visage.surgeplay.com/head/64/" + pop + ".png")
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
    profile
};