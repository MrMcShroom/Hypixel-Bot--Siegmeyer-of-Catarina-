const sql = require("sqlite");
const Discord = require("discord.js");
const request = require('request');
sql.open("./db/data.sqlite");



exports.run = (client, message, args) => {
  let username = args.join("%20");
  request.get("https://www.plazmaburst2.com/extract.php?login=" + username, function(e, res, data) {
  	if(e) {
    	console.error("Error: " + e.toString())
  	}
   	if (!res || res.statusCode !== 200) {
     	console.error("Response error: " + res.toString());
   	}
  	var data = JSON.parse(data);
   	if (data.Error === "User not found") {
   		message.channel.send("This user didn't exist! `!pb2verify login name`");
      return;
   	}
    sql.get(`SELECT * FROM pb2 WHERE discordid = "${message.author.id}"`).then(row => {
    	if (!row) {
            sql.run("INSERT INTO pb2 (discordid) VALUES (?)", [message.author.id]);
            message.channel.send("Execute the command one more time please!");
        return;
    	}
    	if(data.xmpp === message.author.tag || data.skype === message.author.tag || data.icq === message.author.tag ) {
            sql.run(`UPDATE pb2 SET pb2login = "${data.login}" WHERE discordid = ${message.author.id}`);
            message.channel.send("You've been verified, congratulations!");
    	} else {
    		message.channel.send("You need to set your Skype, ICQ, or XMPP to `" + message.author.tag + "`");
    	}
  	}).catch((e) => {
  		console.error(e);
    	sql.run("CREATE TABLE IF NOT EXISTS pb2 (discordid TEXT, pb2login TEXT)").then(() => {
    	    sql.run("INSERT INTO pb2 (discordid) VALUES (?)", [message.author.id]);
      });
    });
  });
}