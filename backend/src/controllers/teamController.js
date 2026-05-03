const Team = require('../models/Team');

// @desc    Get all teams for user
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res, next) => {
    try {
        const teams = await Team.find({
            $or: [{ owner: req.user._id }, { members: req.user._id }]
        }).populate('owner', 'name email avatar');
        
        res.status(200).json(teams);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        
        const team = await Team.create({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id]
        });

        res.status(201).json(team);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTeams,
    createTeam
};
