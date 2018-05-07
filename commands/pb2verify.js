const sql = require("sqlite");
const Discord = require("discord.js");
const request = require('request');
sql.open("./db/data.sqlite");



exports.run = (client, message, args) => {
  let username = args.join("%20");
  try {
  request.get("https://www.plazmaburst2.com/extract.php?login=" + username, function(e, res, data) {
  	if(e) {
    	console.log("Error: " + e)
  	}
   	if (!res || res.statusCode !== 200) {
     	console.log("Response error: " + res);
   	}
  	var data = JSON.parse(data);
   	if (data.Error === "User not found") {
   		message.channel.send("This user didn't exist! `!pb2verify login name`");
      return;
   	}
    sql.get(`SELECT * FROM pb2 WHERE discordid = "${message.author.id}"`).then(row => {
		var date = Math.floor(new Date() / 1000);
		var thirtydaysago = date - 2592000;
    	if (!row) {
            sql.run("INSERT INTO pb2 (discordid) VALUES (?)", [message.author.id]).then(() => {
                if(data.xmpp === message.author.tag || data.skype === message.author.tag || data.icq === message.author.tag ) {
					sql.run(`UPDATE pb2 SET pb2login = "${data.login}" WHERE discordid = ${message.author.id}`);
					message.channel.send("You've been verified, congratulations!")
					if(row.mute) {
						time = new Date();
						mutetime = row.mute
						console.log("rowmute " + row.mute)
						console.log(time + "time")
						if(time <= row.mute) {
							message.channel.send("You are currently muted on the PB2 Discord. You will be unmuted (And allowed to reverify) on: " + mutetime.toUTCString());
							return;
						}
					}
					if(client.guilds.get("328650645793931267").members.has(message.author.id) && thirtydaysago >= registerdate && !client.guilds.get("328650645793931267").member(message.author.id).roles.exists('name', 'Verified') && row.prefix) {
						var verifiedrole = client.guilds.get("328650645793931267").roles.find("name", "Verified");
						var newuserrole = client.guilds.get("328650645793931267").roles.find("name", "New User");
						client.guilds.get('328650645793931267').members.get(message.author.id).addRole(verifiedrole);
						client.guilds.get('328650645793931267').members.get(message.author.id).removeRole(newuserrole);
						client.guilds.get("328650645793931267").members.get(message.author.id).setNickname(data.login);
						message.channel.send("You've also been given the verified role in the PB2 discord chat!");
					}
					else if (client.guilds.get("328650645793931267").members.has(message.author.id) && registerdate >= thirtydaysago && !client.guilds.get("328650645793931267").member(message.author.id).roles.has('name', 'Verified')) {
						message.channel.send("Your account is too new. Your account must be over 30 days old to be verified in the PB2 discord.");
					}
                }
            });
		}

			const mutetime = new Date(row.mute);

    	if(data.xmpp === message.author.tag || data.skype === message.author.tag || data.icq === message.author.tag ) {
			console.log(row);
            sql.run(`UPDATE pb2 SET pb2login = "${data.login}" WHERE discordid = ${message.author.id}`);
			message.channel.send("You've been verified, congratulations!");
			if(row.mute) {
				let dateobject = new Date();
				let time = dateobject.getTime();
				console.log(row.mute + "rowmute ")
				console.log(time + "time")
				if(time <= row.mute) {
					message.channel.send("You are currently muted on the PB2 Discord. You will be unmuted (And allowed to reverify) on: " + mutetime.toUTCString());
					return;
				}
			}
			if (data.register >= data.real_register) {
				var registerdate = data.real_register; 
			} else {
				var registerdate = data.register;
			}
			console.log(registerdate);
			console.log(date);
			if(client.guilds.get("328650645793931267").members.has(message.author.id) && thirtydaysago >= registerdate && !client.guilds.get("328650645793931267").member(message.author.id).roles.exists('name', 'Verified') && row.mute <= date) {
				var verifiedrole = client.guilds.get("328650645793931267").roles.find("name", "Verified");
				var newuserrole = client.guilds.get("328650645793931267").roles.find("name", "New User");
				client.guilds.get('328650645793931267').members.get(message.author.id).addRole(verifiedrole);
				client.guilds.get('328650645793931267').members.get(message.author.id).removeRole(newuserrole);
				client.guilds.get("328650645793931267").members.get(message.author.id).setNickname(data.login);
				message.channel.send("You've also been given the verified role in the PB2 discord chat!");
			}
			else if (client.guilds.get("328650645793931267").members.has(message.author.id) && registerdate >= thirtydaysago && !client.guilds.get("328650645793931267").member(message.author.id).roles.has('name', 'Verified')) {
				message.channel.send("Your account is too new. Your account must be over 30 days old to be verified in the PB2 discord.");
			} else if(client.guilds.get("328650645793931267").members.has(message.author.id) && thirtydaysago >= registerdate && !client.guilds.get("328650645793931267").member(message.author.id).roles.exists('name', 'Verified') && row.mute >= date) {
				message.channel.send("You are currently muted on PB2! You will be unmuted on: " + mutetime.toUTCString());
			}
    	} else {
    		message.channel.send("You need to edit your profile and PB2, and set your skype, XMPP, or ICQ to `" + message.author.tag + "` If you have trouble, try this video! `https://youtu.be/zFyf7D9fXiA`");
    	}
  	}).catch((e) => {
  		console.error(e);
    	sql.run("CREATE TABLE IF NOT EXISTS pb2 (discordid TEXT, pb2login TEXT, mute INTEGER)").then(() => {
    	    sql.run("INSERT INTO pb2 (discordid) VALUES (?)", [message.author.id]);
      });
    });
  });
} catch(err) {
	message.channel.send(err);
	console.log(error);
}
}