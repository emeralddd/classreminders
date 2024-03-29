const { Message, PermissionsBitField } = require('discord.js')
const bot = require('wheat-better-cmd')
const db = require('../models/reminder')

const help = {
    name:"deletereminder",
    aliases: ["delete","dr"]
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
  if(!args[1]) {
    await bot.wheatSendErrorMessage(message,`Chưa nhập ID`)
    return
  }
  
  const tmp = await db.findOneAndRemove({
    id:args[1]
  })

  if(!tmp) {
    await bot.wheatSendErrorMessage(message,`ID không tồn tại`)
    return
  }

  await bot.wheatSend(message,`**Đã xóa!**`)
}

module.exports.run = run

module.exports.help = help