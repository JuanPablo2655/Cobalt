const Discord = require("discord.js");
const fetch = require('node-fetch');


module.exports.run = async (cobalt, message, args, cb) => {
    try {
        const request = await fetch('https://some-random-api.ml/animal/koala');
        const json = await request.json();
        let koalaEmbed = new Discord.MessageEmbed()
            .setTitle(json.fact)
            .setImage(json.image)
            .setTimestamp()
            .setColor('RANDOM')
        message.channel.send(koalaEmbed)  
    } catch (e) {
        cb(e)
    }
}

exports.conf = {
    enabled: true,
    ownerOnly: false,
    cooldown: 2,
    aliases: []
}

exports.help = {
    name: "koala",
    description: "get a random koala pic",
    usage: "koala"
}