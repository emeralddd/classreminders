const Database = require("@replit/database")
const db = new Database()
const bot = require('wheat-better-cmd')
const {Client} = require('discord.js')

/**
 * @param {Client} client
*/

const alert = async (client,val) => {
  const embed = await bot.wheatSampleEmbedGenerate()
  embed.setTitle(`Bạn có một lịch đã được hẹn!`)
  embed.setDescription(val.content)
  const sv = await client.guilds.cache.get(val.server)
  embed.setFooter({text:`Server: ${sv.name}`})
  
  const ch = await client.channels.cache.get(val.channel)
  if(ch) ch.send({embeds:[embed]})

  const us = await client.users.fetch(val.author)
  if(us) await us.send({embeds:[embed]})
}

module.exports = async (client) => {
    const lists = await db.list()

    const now = new Date().getTime()

    for(const i of lists) {
        const val = await db.get(i)
        if(val.next < now) {
            alert(client,val)
            //val.next+=10000
            val.next+=604800000
            db.set(i,val)
        }
    }
}