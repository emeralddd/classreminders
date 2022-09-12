require('events').EventEmitter.prototype._maxListeners = Infinity
require('events').defaultMaxListeners = Infinity
const { Collection, Client, Intents } = require('discord.js')
require('dotenv').config()
const express = require('express')
const { readdirSync } = require('fs')
const moment = require('moment-timezone')
const checkReminder = require('./modules/checkReminder.js')
const mongo = require('mongoose')

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]})
let commandsList = new Collection()
let aliasesList = new Collection()
let isInitial = false

const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(8081)

moment.tz.setDefault("Asia/Ho_Chi_Minh")

const each10Second = async() => {
  setInterval(async() => {
    checkReminder(client)
  },5000)
}

const addCommands = () => {
    const files = readdirSync(`./commands`)
    const jsfile = files.filter(file => file.split('.').pop() === 'js')

    if(jsfile.length === 0) {
        console.error('Chua lenh nao duoc add!')
    }

    for(const file of jsfile) {
        const module = require(`./commands/${file}`)

        if(module.help) {
            commandsList.set(module.help.name,module)
            for(const alias of module.help.aliases) {
                aliasesList.set(alias,module.help.name)
            }
        }
    }
}

const connect = () => {
    try {
        mongo.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.${process.env.DBHOST}.mongodb.net/reminders?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('DB Connected Successfully!')
    } catch (err) {
        if(err) {
            console.log(err.message)
            process.exit(1)
        }
    }
}

const initial = async () => {
    if(isInitial) return
    try {
        addCommands()
        connect()
        isInitial=true
    } catch (error) {
        console.log(error)
    }
}

initial()

client.once('ready', () => {
    client.user.setActivity('with temeralddd#1385', {type:'PLAYING'})
    console.log(`Da dang nhap duoi ten ${client.user.tag}!`)
    each10Second()
})

client.on('messageCreate', async (message) => {
    if(message.channel.type === "dm") return

    const msg = message.content

    try {
        if(!msg) return
        
        const prefix=process.env.PREFIX

        if(!msg.toLowerCase().startsWith(prefix.toLowerCase())) return

        const S = msg.substring(prefix.length).split(' ')
        
        const args = []

        for(const i of S) {
            if(i !== '') args.push(i)
        }

        if(args.length===0) return

        message.language = 'vi_VN'

        const cmd = args[0].toLowerCase()
        let executeCommand = cmd
        if(aliasesList.has(executeCommand)) {
            executeCommand = aliasesList.get(executeCommand)
        }

        if (commandsList.has(executeCommand)) {
            const command = commandsList.get(executeCommand)

            try {
                await command.run({
                    client,
                    S,
                    message,
                    msg,
                    args,
                    prefix,
                    commandsList,
                    aliasesList,
                    cmd
                })
                
            } catch (error) {
                console.log(error)
            } 
        }
    } catch(error) {
        console.log(error)
    }
})

client.login(process.env.TOKEN)
