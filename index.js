const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const request = require('request');
const MojangAPI = require('mojang-api');
const hypixelfunctions = require('./hypixelfunctions.js');
const snekfetch = require('snekfetch');
const url = require('url');
const statistics = require('./statistics.js');
const sql = require("sqlite");
sql.open("./db/data.sqlite");

const talkedRecently = new Set();

client.login(config.token);
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
let eventName = file.split(".")[0];
client.on(eventName, (...args) => eventFunction.run(client, ...args));
});
});
async function reporterror(therror,content,discrim) {
    let botowner = await client.fetchUser(config.ownerID);
        botowner.send("Error: ```" + therror + "``` + Message: ```" + content + "```" + "Sent by: ```" + discrim + "```");
    }
async function dm(id,message) {
    let recipient = await client.fetchUser(id);
        recipient.send(message);
}
function capitalizeFirstLetter(str) {
    return str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

client.on('disconnect', console.log);

    client.on("message", message => {
        if (message.author.bot) return;
        if (message.author.id === "331738876571811852") {
            dm(message.author.id,capitalizeFirstLetter(message.content));
        }
        if (!message.content.startsWith(config.prefix)) return;
        sql.get(`SELECT * FROM bannedusers WHERE discordid = "${message.author.id}"`).then(row => {
            if (row) {
                content = "Ignored a message by `" + message.author.tag + "`"; 
                console.log(content);
                dm(config.ownerID,content);
                return;
            } else {
                const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();
                if (talkedRecently.has(message.author.id))
                     return;

                            // Adds the user to the set so that they can't talk for 2.5 seconds
                    talkedRecently.add(message.author.id);
                    setTimeout(() => {
                      // Removes the user from the set after 2.5 seconds
                     talkedRecently.delete(message.author.id);
                        }, 2500);
                try {
                    try {
                        let commandFile = require(`./commands/${command}.js`);
                    } catch (err) {
                        console.log(err);
                        return;
                    }
                    let commandFile = require(`./commands/${command}.js`);
                    commandFile.run(client, message, args, config, request, MojangAPI, hypixelfunctions, snekfetch, url, statistics);
                } catch (err) {
                    console.log(err);
                    reporterror(err,message.content,message.author.tag);
                    return;
                }
            };
        }).catch((e) => {
                console.log(e);
                console.log("if there was an error");
                sql.run("CREATE TABLE IF NOT EXISTS bannedusers (discordid TEXT)").then(() => {
                        message.channel.send("Try again!");
                        console.log("Tablecreated");
                    }
    
                );
        });
    });
    
            //sql.run("INSERT INTO discord (discordid) VALUES (?)", [message.author.id]);
/*    sql.get(`SELECT * FROM discord WHERE discordid = "${message.author.id}"`).then(row => {
        if (!row) {
                if(message.content.startsWith(config.prefix)) return;
        } else {
            if(message.content.startsWith(row[0].prefix)) return;
        }
      }).catch((e) => {
          console.log(e);
          console.log("if there was an error");
        sql.run("CREATE TABLE IF NOT EXISTS discord (discordid TEXT, prefix TEXT)").then(() => {
            sql.run("INSERT INTO discord (discordid) VALUES (?)", [message.author.id]);  */
            


client.on("ready", () => {
    console.log("Logged in!");
    let setStatus = setInterval(function () {
        var names = [`${client.guilds.size} different servers!`,'for !help',`${client.users.size} users!`];
        var game = names[Math.floor(Math.random() * names.length)];
       client.user.setActivity(game,{ type: 'WATCHING' });
      }, 30000)
});
