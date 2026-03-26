const express = require('express');
const router = express.Router();
const multer = require('multer');
const analyzeController = require('../controllers/analyzeController');

// Multer configured for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint: POST /analyze
router.post('/analyze', upload.single('file'), analyzeController.analyzeData);

module.exports = router;
