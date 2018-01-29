exports.run = (client, message, args) => {
    message.reply("Hey there! If you'd like to add me to your server, click this link! https://discordapp.com/oauth2/authorize?&client_id=361581373309452289&scope=bot&permissions=0").catch(console.error);
}