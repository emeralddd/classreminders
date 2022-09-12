const { Message, Permissions } = require('discord.js')
const bot = require('wheat-better-cmd')
const db = require('../models/reminder')
const moment = require('moment')
const data = require('../data.json')

const help = {
    name:"open",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,args}) => {
  if(message.member.id !== '687301490238554160') {
    await bot.wheatSendErrorMessage(message,`Không có đủ quyền để thực hiện!`)
    return
  }

  const l = data.a;

  for(const i of l) {
    await new db({
        id:i.id,
        ...i.value
    }).save()
    // await db.set(i.id, i.value)
  }
  
  const arr = []  
      
//   db.list().then(async keys => {
//            for(const i of keys) {
//              await db.get(i).then(value => {
//                arr.push({
//                  id: i,
//                  value
//                })
//              });
//            }

//           console.log(arr);
//         });

  message.channel.send('ok')
}

module.exports.run = run

module.exports.help = help