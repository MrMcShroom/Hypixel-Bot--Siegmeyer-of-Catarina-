// JavaScript source code
const MojangAPI = require('mojang-api');
const Discord = require("discord.js");
const hypixelfunctions = require('../hypixelfunctions.js');
const sql = require("sqlite");
sql.open("./db/data.sqlite");


exports.run = (client, message, args, request) => {
    var uuid = hypixelfunctions.validatePlayer(args[0]);
    var date = new Date();
    if (message.mentions.users.first()) {
        sql.get(`SELECT * FROM hypixel WHERE discordid ="${message.mentions.users.first().id}"`).then(row => {
            if (!row) return message.reply("This user has not linked their Minecraft account!");
            uuid = row.uuid;
            var embed = new Discord.RichEmbed()
            .setTitle("Click me to get the raw skin image.")
            .setImage("https://visage.surgeplay.com/full/" + uuid + "?tilt=0")
            .setThumbnail("https://visage.surgeplay.com/head/64/" + uuid + ".png")
            .setURL("https://visage.surgeplay.com/skin/" + uuid)
            client.fetchUser(row.discordid).then(discorduser => {
                embed.setAuthor(discorduser.tag,discorduser.avatarURL);
                message.channel.send({embed:embed});
          });
        });
    }
        else if (!args[0]) {
            sql.get(`SELECT * FROM hypixel WHERE discordid ="${message.author.id}"`).then(row => {
                if (!row) return message.reply("This user has not linked their Minecraft account!");
                uuid = row.uuid;
                var embed = new Discord.RichEmbed()
                .setTitle("Click me to get the raw skin image.")
                .setImage("https://visage.surgeplay.com/full/" + uuid + "?tilt=0")
                .setThumbnail("https://visage.surgeplay.com/head/64/" + uuid + ".png")
                .setURL("https://visage.surgeplay.com/skin/" + uuid)
                client.fetchUser(row.discordid).then(discorduser => {
                    embed.setAuthor(discorduser.tag,discorduser.avatarURL);
                    message.channel.send({embed:embed});
              });
            });
        }
     else {
if (!uuid) {
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
}