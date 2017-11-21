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

client.login(config.token);
let chicken = true;
function status(chicken) {
    if (chicken) {
        client.user.setGame('!help');
        chicken = false;
    } else {
        client.user.setGame('Serving ' + client.guilds.size + "Different servers!");
        chicken = true;
    }
}

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
let eventName = file.split(".")[0];
// super-secret recipe to call events with all their proper arguments *after* the `client` var.
client.on(eventName, (...args) => eventFunction.run(client, ...args));
});
});

client.on("message", message => {
    if (message.author.bot) return;
if(message.content.indexOf(config.prefix) !== 0) return;

// This is the best way to define args. Trust me.
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

// The list of if/else is replaced with those simple 2 lines:
try {
    let commandFile = require(`./commands/${command}.js`);
commandFile.run(client, message, args, config, request, MojangAPI, hypixelfunctions, snekfetch, url, statistics);
} catch (err) {
    console.log(err);
}
});

client.on("ready", () => {
    console.log("Logged in!");
    let setStatus = setInterval(function () {
        var names = [`Serving ${client.guilds.size} different servers!`,'Try !help'];
        var game = names[Math.floor(Math.random() * names.length)];
       client.user.setGame(game);
      }, 30000)
});
