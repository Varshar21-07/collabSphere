const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a document title'],
        trim: true,
        default: 'Untitled Document'
    },
    content: {
        type: Object, // Can be used for Delta or raw text
        default: {}
    },
    team: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team'
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    activeUsers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
