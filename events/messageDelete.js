const Discord = require("discord.js");

module.exports = (cobalt, message) => {
    var log = cobalt.channels.get('405158191324987393');
    let author = message.author;
    let avatar = author.displayAvatarURL;

    let deletedMessage = new Discord.RichEmbed()
        .setTitle('Message deleted')
        .setAuthor(author.username, avatar)
        .addField("Channel", message.channel)
        .addField("Content", message.content)
        .setColor("#d62424")
        .setFooter("ID: "+message.id)
        .setTimestamp();
    log.send(deletedMessage);
}