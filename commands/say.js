const Discord = require("discord.js");

module.exports.run = async (cobalt, message, args) => {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage + "\n" + message.author.username);
}

exports.conf = {
    aliases: ['say']
}

exports.help = {
    name: "say",
    description: "Let the bot say stuff",
    usage: "say [message]"
}