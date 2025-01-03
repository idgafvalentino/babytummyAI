const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const WeightController = require('../controllers/weight.controller');

// Route definitions will go here
// GET /weight/logs
// POST /weight/log
// PUT /weight/log/:id
// DELETE /weight/log/:id

module.exports = router;
