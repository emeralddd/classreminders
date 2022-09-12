const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')
const db = require('../models/reminder')
const moment = require('moment')

const help = {
    name:"allreminders",
    aliases: ["all","ar"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
  const serverId = message.guild.id
  const embed = await bot.wheatSampleEmbedGenerate()
  embed.setTitle('Danh sách lịch tại server')
  const lists = await db.find({
    server:serverId
  }).lean()

  for(const i of lists) {
    embed.addField(`ID: ${i.id}`,`Tạo bởi: <@${i.author}>\nThời gian: ${i.time}\nNội dung: ${i.content}\nKênh gửi: <#${i.channel}>\n${message.member.id === '687301490238554160'?`Test: ${moment(i.next).format("DD MMM YYYY hh:mm")}`:``}`)
  }

  await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help