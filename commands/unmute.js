const sql = require("sqlite");
sql.open("./db/data.sqlite");
const Discord = require("discord.js");


exports.run = (client, message, args) => {
    async function dm(id) {
        let muteduser = await message.client.fetchUser(id);
        var embed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle("You've been unmuted on the PB2 official server, by the staff member listed above.")
        .addField("How Mutes Work", "With the new Mute system, when being muted, you will be unable to verify your PB2 account in the PB2 server until the mute is over. Once it is over, to get back into the chat, simply redo the `!pb2verify` command.")
        .addField("Instruction to access chat again:", "Simple reply to this message and reverify your account like you did when you joined the chat. In your case, simply type: `!pb2verify [pb2 login name]`")
        muteduser.send({embed:embed});
        var embed2 = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle("UnMute on PlazmaBurst 2 Official Discord, by the staff member listed above.")
        .setDescription("I have unmuted the user: `" + muteduser.tag)
        .setFooter(muteduser.tag, muteduser.avatarURL)
        client.guilds.get("328650645793931267").channels.get('332244253424222208').send({embed: embed2})
    }
    if(!message.guild.id === "328650645793931267" || !client.guilds.get("328650645793931267").member(message.author.id).roles.exists('name', 'MutePerms')) return;
    if(!args[0]) { message.channel.send("Please mention a user to unmute."); return; }
    if(message.mentions.users.first().id) {
    let muteduserid = message.mentions.users.first().id;
    sql.get(`SELECT * FROM pb2 WHERE discordid = "${muteduserid}"`).then(row => {
        var currentdate = new Date();
        var currenttime = currentdate.getTime();
        if(row.mute >= currentdate) {
            sql.run(`UPDATE pb2 SET mute = "0" WHERE discordid = ${muteduserid}`).then(() => {
                message.channel.send("User unblocked from verifying / unmuted! You may now tell them to verify themselves, but I've also taken this chance to message them how to do it myself.");
                dm(muteduserid);
            });
        } else{
            message.channel.send("This user is not muted!");
        }

      }).catch((e) => {
          console.error(e);
        sql.run("CREATE TABLE IF NOT EXISTS pb2 (discordid TEXT, pb2login TEXT, mute INTEGER)").then(() => {
            mutetime = Math.round((new Date()).getTime() / 1000) + args[1];
            sql.run("INSERT INTO pb2 (discordid,mute) VALUES (?,?)", [muteduserid,mutetime]);
      });
    });
    } else {
        message.channel.send("There was some sort of error, likely the command was executed incorrectly.");
    }
}