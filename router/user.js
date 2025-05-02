const express = require('express')
const user = require('../contoller/user.controller')
const router = express.Router();

router.post('/GetSkill', user.getSkill)
router.post('/sendemail', user.handleEmailSending)

module.exports = router