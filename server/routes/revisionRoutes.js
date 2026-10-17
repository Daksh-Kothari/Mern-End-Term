const express = require('express');
const router = express.Router();
const { getRevisionQueue, completeRevision } = require('../controllers/revisionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/queue', getRevisionQueue);
router.post('/:topicId/complete', completeRevision);

module.exports = router;
