//1 import express
const express = require('express')


const userControllers = require('../controllers/userControllers')
const stationControllers = require('../controllers/stationControllers')

const adminJWTMiddleware = require('../middlewares/adminJWTMiddleware')
const router = express.Router()

//Register user
router.post('/api/register', userControllers.registerUser)

//login user
router.post('/api/login', userControllers.loginUser)

//Googlelogin user
router.post('/api/google-login', userControllers.googleAuth)

//Register owner
router.post('/api/registerowner', userControllers.registerOwner)

//get Pending Stations
router.get('/api/admin/getPendingStations',stationControllers.getPendingStations)

// update Station Status
router.put('/api/admin/station-status/:id', adminJWTMiddleware, stationControllers.updateStationStatus);

//get View Stations
router.get('/api/admin/getVerifiedStationsAPI',stationControllers.getViewStations)

// Get all users for Admin View
router.get('/api/admin/all-users', adminJWTMiddleware, userControllers.getAllUsers);

// update Station Status
router.put('/api/admin/update-user-status/:id', adminJWTMiddleware, userControllers.updateUsersStatus);

module.exports = router;