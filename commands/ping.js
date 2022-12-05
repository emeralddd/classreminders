const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"ping",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
    const embed = bot.wheatSampleEmbedGenerate()
    embed.setDescription(`**Pong! in ${new Date().getTime() - message.createdTimestamp} miliseconds!**`)
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help