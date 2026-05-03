const Document = require('../models/Document');

// @desc    Get user's documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({
            $or: [{ creator: req.user._id }, { 'team': { $exists: true } }] // Simplified for tutorial
        }).populate('creator', 'name avatar');
        
        res.status(200).json(documents);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a document
// @route   POST /api/documents
// @access  Private
const createDocument = async (req, res, next) => {
    try {
        const { title, team } = req.body;
        
        const document = await Document.create({
            title: title || 'Untitled Document',
            team: team || undefined,
            creator: req.user._id,
            content: { ops: [{ insert: '\n' }] } // Default fresh Delta
        });

        res.status(201).json(document);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            res.status(404);
            return next(new Error('Document not found'));
        }

        const updatedDocument = await Document.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedDocument);
    } catch (error) {
        next(error);
    }
};


// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            res.status(404);
            return next(new Error('Document not found'));
        }
        res.status(200).json(document);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDocuments,
    createDocument,
    updateDocument,
    getDocument
};
