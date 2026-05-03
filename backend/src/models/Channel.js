const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a channel name'],
        trim: true
    },
    team: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team',
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'voice'],
        default: 'text'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Channel', channelSchema);
