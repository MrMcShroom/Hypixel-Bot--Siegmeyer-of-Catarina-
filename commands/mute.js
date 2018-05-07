const sql = require("sqlite");
const Discord = require("discord.js");
const request = require('request');
sql.open("./db/data.sqlite");



exports.run = (client, message, args) => {
    async function unmutemessage(id) {
        let muteduser = await message.client.fetchUser(id);
        var embed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle("You've been unmuted on the PB2 official server, because your mute has expired")
        .addField("How Mutes Work", "With the new Mute system, when being muted, you will be unable to verify your PB2 account in the PB2 server until the mute is over. Once it is over, to get back into the chat, simply redo the `!pb2verify` command.")
        .addField("Instruction to access chat again:", "Simple reply to this message and reverify your account like you did when you joined the chat. In your case, simply type: `!pb2verify [pb2 login name]`")
        muteduser.send({embed:embed});
        var embed2 = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle("UnMute on PlazmaBurst 2 Official Discord, by cause of mute expiration.")
        .setDescription("I have unmuted the user: `" + muteduser.tag + "`")
        .setFooter(muteduser.tag, muteduser.avatarURL)
        client.guilds.get("328650645793931267").channels.get('332244253424222208').send({embed: embed2})
    }
    async function dm(id,mutereason,datevalueunmutetime,currentdate,mutetimeinms) {
        mutereason = mutereason.join(" ");
        let muteduser = await message.client.fetchUser(id);
        var embed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle("Mute on PlazmaBurst 2 Official Discord, by the staff member listed above.")
        .setDescription("Hello there. You have been muted. If you believe this is an error, please message a staff.")
        .addField("Reason: ", mutereason)
        .addField("Mute time in Seconds", mutetimeinms / 1000)
        .addField("Expiration: ", datevalueunmutetime)
        .addField("Current Time", currentdate)
        .addField("How Mutes Work", "With the new Mute system, when being muted, you will be unable to verify your PB2 account in the PB2 server until the mute is over. Once it is over, to get back into the chat, simply redo the `!pb2verify` command.")
        muteduser.send({embed:embed});
        var embed2 = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle("Mute on PlazmaBurst 2 Official Discord, by the staff member listed above.")
        .setDescription("I have muted the user: `" + muteduser.tag + "` For the mute reason `" + mutereason + "` If you believe this is an error, please contact Zap or unmute them with the unmute command.")
        .addField("Reason: ", mutereason)
        .addField("Mute time in Seconds", mutetimeinms / 1000)
        .addField("Expiration: ", datevalueunmutetime)
        .addField("Current Time", currentdate)
        .addField("See the user in the footer for the muted user.","Note that this is their Discord ID, not their server nickname.")
        .setFooter(muteduser.tag, muteduser.avatarURL)
        client.guilds.get("328650645793931267").channels.get('332244253424222208').send({embed: embed2})
        setTimeout(async function(){
            unmutemessage(id);
        },mutetimeinms);
    }
    var currentdate = new Date();
    var currenttime = currentdate.getTime()
    let mutereason = args.slice();
    mutereason.splice(0, 2); 
    mutereason.join(' ');
    if(!message.guild.id === "328650645793931267" || !client.guilds.get("328650645793931267").member(message.author.id).roles.exists('name', 'MutePerms')) return;
    if(!args[1]) message.channel.send("Please use this format: `!mute [@mention the user] [the time in milliseconds] [the reason may include spaces]`");
    if(message.mentions.users.first()) {
       let muteduserid = message.mentions.users.first().id;
    if(message.guild.id === "328650645793931267" && client.guilds.get("328650645793931267").member(message.author.id).roles.exists('name', 'MutePerms')) {
        sql.get(`SELECT * FROM pb2 WHERE discordid = "${message.mentions.users.first().id}"`).then(row => {
            let mutetimeinms = parseInt(args[1])
            let mutetime = Math.round((new Date()).getTime()) + mutetimeinms;
            let datevalueunmutetime = new Date(mutetime);
            if(!row || !row.pb2login || row.discordid) {
                sql.run("INSERT INTO pb2 (discordid) VALUES (?)", [muteduserid]).then(() => {
                    sql.run(`UPDATE pb2 SET mute = "${mutetime}" WHERE discordid = ${muteduserid}`).then(() => {
                        message.channel.send("User muted! They cannot verify until: " + datevalueunmutetime);
                        dm(muteduserid,mutereason,datevalueunmutetime,currentdate,mutetimeinms);
                        if(message.client.guilds.get("328650645793931267").member(row.discordid).roles.exists("name", "Verified")) {
                            let newuserrole = client.guilds.get("328650645793931267").roles.find("name", "New User");
                            let verifiedrole = client.guilds.get("328650645793931267").roles.find("name", "Verified");
                            message.client.guilds.get('328650645793931267').members.get(muteduserid).removeRole(verifiedrole);
                            message.client.guilds.get('328650645793931267').members.get(muteduserid).addRole(newuserrole);
                            message.channel.send("I have removed their verified role, and the user will be unable to verify until the mute is over.")
                        }
                    });
                });
            } else {
            if(!row.mute) {
                let formermute = 0;
            } else {
                let formermute = row.mute;
            }
            if(formermute >= currenttime) {
                unmutetime = new Date(row.mute);
                message.channel.send("User is already muted! They were muted until: " + unmutetime);
                sql.run(`UPDATE pb2 SET mute = "${mutetime}" WHERE discordid = ${muteduserid}`);
                message.channel.send("I've gone ahead anyway and changed the mute on the user. It is now: " + datevalueunmutetime);
                dm(muteduserid,mutereason,datevalueunmutetime,currentdate,mutetimeinms);
            } else {
                sql.run(`UPDATE pb2 SET mute = "${mutetime}" WHERE discordid = ${muteduserid}`).then(row => { 
                    message.channel.send("User muted! They cannot verify until: " + datevalueunmutetime);
                    dm(muteduserid,mutereason,datevalueunmutetime,currentdate,mutetimeinms);
                })
                
            }
            if(message.client.guilds.get("328650645793931267").member(row.discordid).roles.exists("name", "Verified")) {
                let newuserrole = client.guilds.get("328650645793931267").roles.find("name", "New User");
                let verifiedrole = client.guilds.get("328650645793931267").roles.find("name", "Verified");
                message.client.guilds.get('328650645793931267').members.get(muteduserid).removeRole(verifiedrole);
                message.client.guilds.get('328650645793931267').members.get(muteduserid).addRole(newuserrole);
                message.channel.send("I have removed their verified role, and the user will be unable to verify until the mute is over.")
                dm(muteduserid,mutereason,datevalueunmutetime,currentdate,mutetimeinms);


            }
        }
          }).catch((e) => {
              console.error(e);
            message.channel.send("Error!")
        });
    }
    } else {
        message.channel.send("You did not tag a user to mute!");
    }
}