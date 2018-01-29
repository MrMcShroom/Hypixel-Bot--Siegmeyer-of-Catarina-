// JavaScript source code
exports.run = (client, message, args) => {
    message.channel.send("Pong! The ping is **" + client.ping.toFixed(0) + '**ms! :ping_pong:').catch(console.error);
}