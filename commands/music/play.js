const {
    Util
} = require("discord.js")
const {
    play
} = require("../../utils/play")
const {
    YOUTUBE_API_KEY
} = require("../../config.json")
const ytdl = require("ytdl-core")
const YouTubeAPI = require("simple-youtube-api")
const youtube = new YouTubeAPI(YOUTUBE_API_KEY)

module.exports.run = async (cobalt, message, args, cb) => {
    try {
        const {
            channel
        } = message.member.voiceChannel
        console.log("VC: " + channel)

        if (!args.length) return message.reply("Usage: cn!play [VIDEO URL|VIDEO NAME]").catch(err => cb(err));
        if (!channel) return message.reply("You need to join a voice channel first!").catch(err => cb(err));

        const permissions = channel.permissionsFor(message.cobalt.user)
        if (!permissions.has("CONNECT")) return message.reply("Cannot connect to voice channel, missing permissions")
        if (!permissions.has("SPEAK")) return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!")

        const search = args.join(" ")
        const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/ig;
        const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/ig;
        const url = args[0]
        const urlValid = videoPattern.test(args[0])

        // Start the playlist if playlist url was provided
        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return message.cobalt.commands.get("playlist").execute(message, args)
        }

        const serverQueue = message.cobalt.queue.get(message.guild.id)
        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true
        }

        let songInfo = null
        let song = null

        if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url)
                song = {
                    title: songInfo.title,
                    url: songInfo.video_url,
                    duration: songInfo.length_seconds
                }
            } catch (error) {
                if (error.message.includes("copyright")) {
                    return message.reply("⛔ The video could not be played due to copyright protection ⛔").catch(err => cb(err));
                } else {
                    console.error(error)
                }
            }
        } else {
            try {
                const results = await youtube.searchVideos(search, 1)
                songInfo = await ytdl.getInfo(results[0].url)
                song = {
                    title: songInfo.title,
                    url: songInfo.video_url,
                    duration: songInfo.length_seconds
                }
            } catch (error) {
                console.error(error)
            }
        }

        if (serverQueue) {
            serverQueue.songs.push(song)
            return serverQueue.textChannel.send(`✅ **${song.title}** has been added to the queue by ${message.author}`).catch(err => cb(err));
        } else {
            queueConstruct.songs.push(song)
        }

        if (!serverQueue) message.cobalt.queue.set(message.guild.id, queueConstruct)

        if (!serverQueue) {
            try {
                queueConstruct.connection = await channel.join()
                play(queueConstruct.songs[0], message)
            } catch (error) {
                console.error(`Could not join voice channel: ${error}`)
                message.cobalt.queue.delete(message.guild.id)
                await channel.leave()
                return message.channel.send(`Could not join the channel: ${error}`).catch(err => cb(err));
            }
        }
    } catch (e) {
        cb(e)
    }
}

exports.conf = {
    enabled: true,
    aliases: []
}

exports.help = {
    name: "play",
    description: "Plays audio from YouTube",
    usage: "play [VIDEO URL|VIDEO NAME]"
}