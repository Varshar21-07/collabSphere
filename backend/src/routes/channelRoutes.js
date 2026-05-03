const express = require('express');
const router = express.Router();
const { getChannels, createChannel } = require('../controllers/channelController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createChannel);
router.route('/:teamId').get(protect, getChannels);

module.exports = router;
