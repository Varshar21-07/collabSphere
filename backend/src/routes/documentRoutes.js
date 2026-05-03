const express = require('express');
const router = express.Router();
const { getDocuments, createDocument, updateDocument, getDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDocuments).post(protect, createDocument);
router.route('/:id').get(protect, getDocument).put(protect, updateDocument);

module.exports = router;
