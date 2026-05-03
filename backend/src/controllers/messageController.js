const Message = require('../models/Message');

// @desc    Get messages for channel
// @route   GET /api/messages/:channelId
// @access  Private
const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ channel: req.params.channelId })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 });
        
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new message
// @route   POST /api/messages
// @access  Private
const createMessage = async (req, res, next) => {
    try {
        const { content, channel } = req.body;
        
        const message = await Message.create({
            content,
            channel,
            sender: req.user._id
        });

        await message.populate('sender', 'name avatar');

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMessages,
    createMessage
};
