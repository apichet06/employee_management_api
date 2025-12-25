const express = require('express');
const router = express.Router();

const Auth = require('../middleware/auth');
const LogsController = require('../controllers/logsController');


router.get("/", LogsController.lostList);

module.exports = router;