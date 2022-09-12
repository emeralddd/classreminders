const mongo = require('mongoose')
const Schema = mongo.Schema

const Reminder = new Schema({
        id: {
            type: String,
            required: true,
            unique: true
        },
        server: {
            type: String,
        },
        author: {
            type: String,
        },
        channel: {
            type: String
        },
        time: {
            type: String
        },
        next: {
            type: Number
        },
        content: {
            type: String
        }
    }
)
module.exports = mongo.model('reminders',Reminder)