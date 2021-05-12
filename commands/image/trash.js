const { MessageAttachment } = require("discord.js");
const { Trash } = require("discord-image-generation")

module.exports.run = async (cobalt, message, args, addCD, cb) => {
    try {
        addCD();
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.username === args.slice(0).join(' ') || member.user.username === args[0]) || message.member;
        let avatar = member.user.displayAvatarURL({ dynamic: false, format: 'png' });
        let img = await new Trash().getImage(avatar);
        let attach = new MessageAttachment(img, "trash.png");
        message.channel.send(attach)
    } catch (e) {
        cb(e)
    }
}

exports.conf = {
    enabled: true,
    ownerOnly: false,
    cooldown: 10,
    aliases: []
}

exports.help = {
    name: "trash",
    description: "trash image",
    usage: "trash"
}