const db = require('../models/reminder')
const { Client } = require('discord.js')
const bot = require('wheat-better-cmd')

/**
 * @param {Client} client
*/

const alert = async (client, val) => {
  const embed = bot.wheatSampleEmbedGenerate()
  embed.setTitle(`Bạn có một lịch đã được hẹn!`)
  embed.setDescription(val.content)
  const sv = client.guilds.cache.get(val.server)
  if (!sv) return;
  embed.setFooter({ text: `Server: ${sv.name}` })

  const ch = client.channels.cache.get(val.channel)
  if (ch) ch.send({ content: `@everyone`, embeds: [embed] })

  const us = await client.users.fetch(val.author)
  //   console.log('abc')
  if (us) await us.send({ embeds: [embed] })
}

module.exports = async (client) => {
  const lists = await db.find({})

  const now = new Date().getTime()

  for (const i of lists) {
    if (i.next < now) {
      if (now - i.next <= 36000000) alert(client, i)
      while (i.next < now) i.next += 604800000
      await i.save()
    }
  }
}