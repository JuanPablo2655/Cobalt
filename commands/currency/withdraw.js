const Discord = require("discord.js");

module.exports.run = async (cobalt, message, args, cb) => {
    try {
        let moneyEmoji = cobalt.emojis.cache.get("426859750798655489");

        let userData = await cobalt.fetchEconUser(message.author.id)
        if (!args[0]) return message.channel.send("How much money?")
        if (isNaN(parseInt(args[0], 10)) && args[0] !== 'all') return message.channel.send("Please input a valid number");
        let money = Number(args[0])

        if (userData.deposited - money <= 0) return message.channel.send("You don\'t have that much money deposited");
        if (args[0] == 'all') money = userData.deposited
        if (money <= 0) return message.channel.send("You can't withdraw money you don\'t have");
        userData.onHand += Number(money)
        userData.deposited -= Number(money)
        userData.save().catch(err => cb(err));
        message.channel.send(`You withdrew ₡${money} your bank balance is now ₡${userData.deposited}`);
    } catch (e) {
        cb(e)
    }
}

exports.conf = {
    enabled: true,
    ownerOnly: false,
    cooldown: 2,
    aliases: ['with']
}

exports.help = {
    name: "withdraw",
    description: "withdraw your money",
    usage: "withdraw [all|amount]"
}