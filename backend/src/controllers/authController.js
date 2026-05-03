const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log('Registration attempt:', { name, email });

        if (!name || !email || !password) {
            console.log('Missing fields');
            res.status(400);
            return next(new Error('Please add all fields'));
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists');
            res.status(400);
            return next(new Error('User already exists'));
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            console.log('User created successfully:', user._id);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            console.log('Invalid user data (creation failed)');
            res.status(400);
            next(new Error('Invalid user data'));
        }
    } catch (error) {
        console.error('Registration error:', error.message);
        next(error);
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            next(new Error('Invalid credentials'));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe
};
