const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/auth');

router.get('/download', authenticate, reportController.downloadReport);
router.get('/:filterType', authenticate, reportController.getFilteredReport);

module.exports = router;