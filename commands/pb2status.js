const request = require('request');
const Discord = require("discord.js");

exports.run = (client, message, args) => {
    function data(e, res, data) {
           // If there is no error
    if (!e) {
        // If there is a response and a response code of 200 (that's a good thing)
        if (res && res.statusCode === 200) {
          // Whatever you want to do with your data goes in here. Just console logging it for the purpose of the example.
          data = data.split(";");
          var embed = new Discord.RichEmbed()
          data.array.forEach(element => {
              embed.addField("data")
          });
          }
         else {
          // No response or wasn't a successful request (not code 200), so log it to the console
          console.error("Response error: " + res.toString());
        }
      } else {
        // There was some other error
        console.error("Error: " + e.toString())
      }
    }
    request.get("https://www.plazmaburst2.com/pb2/server.php?rq=srvrs", data);
    }
