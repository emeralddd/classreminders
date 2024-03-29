const { Message, PermissionsBitField } = require('discord.js')
const bot = require('wheat-better-cmd')
const db = require('../models/reminder')
const moment = require('moment')

const help = {
    name:"setreminder",
    aliases: ["set","sr"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,args}) => {
  if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator)&&!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)&&message.member.id!=='687301490238554160') {
    await bot.wheatSendErrorMessage(message,`Không có đủ quyền để thực hiện!`)
    return
  }

  //r-set 12:30 27/06/2022 Lich hoc

  const time = moment(args[1]+" "+args[2],'HH:mm DD/MM/YYYY',true)
  if(!time.isValid()) {
    await bot.wheatSendErrorMessage(message,`Sai cấu trúc ngày giờ!`)
    return
  }

  if(time.isBefore(new Date())) {
    await bot.wheatSendErrorMessage(message,`Nhập một thời gian trong tương lai!`)
    return
  }

  let content=""
  for(let i=3; i<args.length; i++) 
    content+=args[i]+" "

  if(!content) content='empty'

  const days=['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7']

  //console.log(time.valueOf())

  //message.channel.send(`${days[time.day()]} abc`)

  await new db({
    id:message.id,
    server:message.guild.id,
    author:message.member.id,
    channel:message.channel.id,
    time:`${args[1]} mỗi ${days[time.day()]}`,
    next:time.valueOf(),
    content:content
  }).save()

  const embed = bot.wheatSampleEmbedGenerate()

  embed.setTitle('Đã đặt lịch thành công!')
  embed.addFields({
    name:`Ngày bắt đầu`,
    value: args[2]
  },{
    name:`Lặp lại`,
    value: `${args[1]} mỗi ${days[time.day()]}`
  },{
    name:`Nội dung`,
    value: content
  })

  await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help