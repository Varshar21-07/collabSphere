const Channel = require('../models/Channel');

// @desc    Get channels by team
// @route   GET /api/channels/:teamId
// @access  Private
const getChannels = async (req, res, next) => {
    try {
        const channels = await Channel.find({ team: req.params.teamId });
        res.status(200).json(channels);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new channel
// @route   POST /api/channels
// @access  Private
const createChannel = async (req, res, next) => {
    try {
        const { name, team, type } = req.body;
        
        const channel = await Channel.create({
            name,
            team,
            type: type || 'text'
        });

        res.status(201).json(channel);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getChannels,
    createChannel
};
