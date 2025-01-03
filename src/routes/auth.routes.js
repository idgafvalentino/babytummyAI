const express = require('express');
const router = express.Router();
const { validateRegistration, validateLogin } = require('../middleware/validation');
const AuthController = require('../controllers/auth.controller');

// Route definitions will go here
// POST /auth/register
// POST /auth/login
// POST /auth/logout
// GET /auth/verify

module.exports = router;
