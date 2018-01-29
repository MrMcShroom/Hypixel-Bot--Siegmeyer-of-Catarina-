 const sql = require("sqlite");
sql.open("./db/data.sqlite");


exports.run = (client, message, args) => {
    newprefix = args[0];
    if(newprefix.length <= 3) {
    sql.get(`SELECT * FROM discord WHERE discordid = "${message.author.id}"`).then(row => {
        if (!row) {
        console.log("no error so far, gonna update your prefix, row didnt exist")
        sql.run("INSERT INTO discord (prefix,discordid) VALUES (?,?)", [newprefix,message.author.id]);
        message.channel.send("Your new prefix has been updated!");
        } else {
            console.log("no error so far, gonna update your prefix, exists")
            sql.run(`UPDATE discord WHERE discordid = "${message.author.id}" (prefix) VALUES (?)`, [newprefix]);
            message.channel.send("Your new prefix has been updated!");
        }
      }).catch((e) => {
          console.log(e);
        sql.run("CREATE TABLE IF NOT EXISTS discord (discordid TEXT, prefix TEXT)").then(() => {
            sql.run("INSERT INTO discord (discordid) VALUES (?)", [message.author.id]);
    });
  });
} else {
    message.channel.send("Your prefix is too long, it must be three characters or less.");
}
} 