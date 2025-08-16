const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/auth');

router.get('/:filterType', authenticate, reportController.getFilteredReport);
router.get('/download', authenticate, reportController.downloadReport);

module.exports = router;