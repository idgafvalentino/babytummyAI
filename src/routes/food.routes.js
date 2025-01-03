const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FoodController = require('../controllers/food.controller');

// Route definitions will go here
// GET /food/entries
// POST /food/entry
// PUT /food/entry/:id
// DELETE /food/entry/:id

module.exports = router;
