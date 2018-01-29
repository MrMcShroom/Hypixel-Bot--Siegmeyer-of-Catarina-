const request = require('request');
const Discord = require("discord.js");
const config = require('../config.json');
const sql = require("sqlite");
sql.open("./db/data.sqlite");



async function rankcolor(data) {
  if (data.chat_admin === "1") {
    return "0xFF0000";
  } else if (data.chat_moderator === "2") {
    return "0x3498DB";
  } else if (data.chat_moderator === "1") {
    return "0x00F5FF";
  } else if (data.multiplayer_moderator === "1") {
    return "0x26FF00";
  } else {
    return sql.get(`SELECT * FROM pb2 WHERE pb2login ="${data.login}" AND discordid IS NOT NULL`).then(row => {
      if (!row) return "0xE67E22";
      return "0xF1C40F";
    });
  }
}


function blank(value) {
  if (value) {
    return value;
  } else {
    return "None";
  }
}

function profilepicture(data) {
  var number = ("0000" + data.mdl).slice(-4);
  if (data.mdl >= 41 && data.mdl <= 49) {
    var chicken = data.mdl - 40;
    var number = ("0000" + chicken).slice(-4);
    return "http://mcshroom.com/pb2characters/pb2characters/chars_hero" + number + ".jpg";
  } else if (data.mdl === 61) {
    return "http://mcshroom.com/pb2characters/pb2characters/chars_proxy.jpg";
  } else {
    return "http://mcshroom.com/pb2characters/pb2characters/chars" + number + ".jpg";
  }
}



exports.run = (client, message, args) => {
  async function rank(data) {
    if (data.chat_admin === "1") {
      return "Admin";
    } else if (data.chat_moderator === "2") {
      return "Head Moderator";
    } else if (data.chat_moderator === "1") {
      return "Moderator";
    } else if (data.multiplayer_moderator === "1") { // ?????
      return "Trial Staff / Site Support";
    } else {
      return sql.get(`SELECT * FROM pb2 WHERE pb2login ="${data.login}" AND discordid IS NOT NULL`).then(row => {
        console.log(row)
        if (!row) return "Not Verified on Discord";
        if(message.client.guilds.get("328650645793931267").member(row.discordid) && message.client.guilds.get("328650645793931267").member(row.discordid).roles.exists("name", "Creator")) {
          return "Contributor";
        } else {
          return "Verified Discord User"
        }
        
      });
    }
  }
  async function pb2data(e, res, data) {
    // If there is no error
    if (!e) {
      // If there is a response and a response code of 200 (that's a good thing)
      if (res && res.statusCode === 200) {
        // Whatever you want to do with your data goes in here. Just console logging it for the purpose of the example.
        var data = JSON.parse(data); //This will make it so your code makes the data from PB2 readable and usable!
        if (data.Error === "User not found") {
          message.channel.send("This user didn't exist! `!pb2 login name`");
        } else {
          var kdr = data.s_kills / data.s_deaths;
          var loginurlformat = data.login;
          loginurlformat = loginurlformat.replace(/\s/g, '%20');
          let prank = await rank(data);
          let prankcolor = await rankcolor(data);
          var creationdate = new Date(data.real_register * 1000);
          var embed = new Discord.RichEmbed()
            .setDescription(data.nickname + "'s PB2 Profile")
            .addField("Slogan", blank(data.slogan))
            .addField("Country", blank(data.country_code), true)
            .addField("Gender", blank(data.gender), true)
            .addField("Birthday", blank(data.birth), true)
            .addField("Kills", blank(data.s_kills), true)
            .addField("Deaths", blank(data.s_deaths), true)
            .addField("PPP", blank(data.player_rank), true)
            .addField("LDR", blank(data.dev_rank), true)
            .addField("KDR", kdr.toFixed(2), true)
            .addField("Rank", prank)
            .addField("Skype", blank(data.skype), true)
            .addField("Discord", blank(data.icq), true)
            .addField("XMPP", blank(data.xmpp), true)
            .addField("Earliest action on account", creationdate, true)
            .addField("Profile Link", 'http://plazmaburst2.com/?a=&s=7&ac=' + loginurlformat + '&id=' + data.uid, true)
            .setThumbnail(profilepicture(data))
            .setColor(prankcolor)
            .setFooter("Pulled with love from the Plazma Burst 2 API by " + config.botname);
          sql.get(`SELECT * FROM pb2 WHERE pb2login ="${data.login}" AND discordid IS NOT NULL`).then(row => {
            if (!row) return message.channel.send({
              embed: embed
            });
            client.fetchUser(row.discordid).then(discorduser => {
              embed.setAuthor(discorduser.tag, discorduser.avatarURL);
              message.channel.send({
                embed: embed
              });
            });
          });
        }
      } else {
        // No response or wasn't a successful request (not code 200), so log it to the console
        console.error("Response error: " + res.toString());
      }
    } else {
      // There was some other error
      console.error("Error: " + e.toString())
    }
  }
  if (message.mentions.users.first()) {
    sql.get(`SELECT * FROM pb2 WHERE discordid ="${message.mentions.users.first().id}"`).then(row => {
      if (!row) return message.reply("This user has not linked their PB2 account!");
      let username = row.pb2login;
      username = username.replace(" ", "%20");
      request.get("https://www.plazmaburst2.com/extract.php?login=" + username, pb2data);
      console.log("Displaying " + username + "'s PB2 profile through a discord mention.");
    });
  }
  else if (!args[0]) {
    sql.get(`SELECT * FROM pb2 WHERE discordid ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("If you want to pull your own stats by not supplying a user, you need to link your discord! `!pb2verify`");
      let username = row.pb2login;
      username = username.replace(" ", "%20");
      request.get("https://www.plazmaburst2.com/extract.php?login=" + username, pb2data);
      console.log("Displaying " + username + "'s PB2 profile through a discord mention.");
    });
  }
   else {
    let username = args.join("%20"); //This is a variable that will take the first string in array named args, and make it my login name
    request.get("https://www.plazmaburst2.com/extract.php?login=" + username, pb2data);
    console.log("Displaying " + username + "'s PB2 profile without a discord mention.");
  }
}