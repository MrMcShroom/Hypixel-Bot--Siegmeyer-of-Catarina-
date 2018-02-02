const config = require('../config.json');

exports.run = (client, message, args) => {
    async function getuser() {
    let botowner = await message.client.fetchUser(config.ownerID);
    if(!args[0]) {
        message.reply("To make a suggestion, do `!suggest [put suggestion here]`")
    } else {
        botowner.send("```" + message.content.slice(8) + "```" + " Suggestion sent by ```" + message.author.tag + "```");
        message.reply("Your suggestion has been recorded, thank you for giving us your input!");
    }
    }
    getuser();
}