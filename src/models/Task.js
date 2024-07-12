const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    task: {
        type: String,
        default: 0,
    },
    date_time: {
        type: Date,
        default: 0,
    },
    user_date_time: {
        type: String,
        default: 0,
    },
    priority: {
        type: Number,
        default: 0,
    }
});

module.exports = model('Task', taskSchema);