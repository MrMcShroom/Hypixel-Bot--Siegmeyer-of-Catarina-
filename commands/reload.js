// JavaScript source code
exports.run = (client, message, args, config) => {
    if(message.author.id === config.ownerID) {
    if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
// the path is relative to the *current folder*, so just ./filename.js
delete require.cache[require.resolve(`./${args[0]}.js`)];
message.reply(`The command ${args[0]} has been reloaded`);
} else {
    message.reply("You don't have permission to do this!");
}
};