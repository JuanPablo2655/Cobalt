const mongoose = require('mongoose');
const { Guild } = require('../models');

module.exports = cobalt => {

    cobalt.getGuild = async (guild) => {
        let data = await Guild.findOne({ guildID: guild.id });
        if (data) return data;
        else return cobalt.config.defaultSettings;
    };

    cobalt.updateGuild = async (guild, settings) => {
        let data = await cobalt.getGuild(guild);

        if (typeof data !== 'object') data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
            else return;
        }

        console.log(`Guild "${data.guildName}" updated settings: ${Object.keys(settings)}`);
        return await data.updateOne(settings);
    };

    cobalt.createGuild = async (settings) => {
        let defaults = Object.assign({ _id: mongoose.Types.ObjectId() }, cobalt.config.defaultSettings);
        let merged = Object.assign(defaults, settings);

        const newGuild = await new Guild(merged);
        return newGuild.save()
            .then(console.log(`Default settings saved for guild "${merged.guildName}" (${merged.guildID})`));
    };

    cobalt.clean = text => {
        if (typeof(text) === "string") {
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        } else {
            return text;
        }
    };
};