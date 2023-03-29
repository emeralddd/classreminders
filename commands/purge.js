const { Message, PermissionsBitField } = require('discord.js')
const bot = require('wheat-better-cmd')
const db = require('../models/reminder')

const help = {
    name:"purge",
    aliases: ["p"]
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

  const delMessage = await message.channel.messages.fetch(args[1]);
  
  await delMessage.delete();
}

module.exports.run = run

module.exports.help = help