const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')
const Database = require("@replit/database")
const db = new Database()
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
  const lists = await db.list()

  for(const i of lists) {
    const val = await db.get(i)
    if(val.server === serverId) 
      embed.addField(`ID: ${i}`,`Tạo bởi: <@${val.author}>\nThời gian: ${val.time}\nNội dung: ${val.content}\nKênh gửi: <#${val.channel}>\n${message.member.id === '687301490238554160'?`Test: ${moment(val.next).format("DD MMM YYYY hh:mm")}`:``}`)
  }

  await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help