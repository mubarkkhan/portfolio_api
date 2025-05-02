const express = require('express')
const admin = require('../contoller/admin.contoller')
const upload = require('../middelware/multer')

const router = express.Router();

router.post('/adminLogin', admin.adminLogin)
router.post('/emailsending', admin.handleEmailSending)

// offer
router.post('/addoffer', admin.addOffer)
router.get('/getoffer', admin.getOffer)
router.delete('/deleteoffer', admin.deleteOffer)
router.post('/updateoffer', admin.updateOffer)
// banner
router.post('/addBanner', upload, admin.addBanner)
router.get('/getBanner', admin.getBanner)
router.delete('/deleteBanner', admin.deleteBanner)
router.post('/updateBanner', upload, admin.updateBanner)
// about
router.post('/addAbout', admin.addAbout)
router.get('/getAbout', admin.getAbout)
router.delete('/deleteAbout', admin.deleteAbout)
router.post('/updateAbout', admin.updateAbout)
// skill
router.post('/addSkill', admin.addSkill)
router.get('/getSkill', admin.getSkill)
router.post('/deleteSkill', admin.deleteSkill)
router.post('/updateSkill', admin.updateSkill)
// project
router.post('/addProject', upload, admin.addProject)
router.get('/getProject', admin.getProject)
router.post('/deleteProject', admin.deleteProject)
router.post('/updateProject', upload, admin.updateProject)
// experience
router.post('/addExperience', admin.addExperience)
router.get('/getExperience', admin.getExperience)
router.post('/deleteExperience', admin.deleteExperience)
router.post('/updateExperience', admin.updateExperience)

module.exports = router