//1 import express
const express = require('express')


const userControllers = require('../controllers/userControllers')
const stationControllers = require('../controllers/stationControllers')
const socketControllers = require('../controllers/socketControllers')

const adminJWTMiddleware = require('../middlewares/adminJWTMiddleware')
const ownerJWTMiddleware = require('../middlewares/ownerJWTMiddleware')
const jwtMiddleware = require('../middlewares/jwtMiddleware')

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


// Get stations of owner View
router.get('/api/owner/view-owner-stations', ownerJWTMiddleware, stationControllers.getViewOwnerStations);


// Add stations By owner 
router.post('/api/owner/add-owner-stations', ownerJWTMiddleware, stationControllers.registerNewStationByOwner);

// Add socket By owner 
router.post('/api/owner/add-owner-socket', ownerJWTMiddleware, socketControllers.registerNewSocket);

// Get socket By owner 
router.post('/api/owner/get-station-socket', ownerJWTMiddleware, socketControllers.getStationSockets);

// Get approved Stations for user
router.post('/api/user/get-approved-stations', jwtMiddleware, stationControllers.getApprovedStations);

// Get Selected Stations for user
router.get('/api/user/get-view-stations', jwtMiddleware, stationControllers.getStationById);


module.exports = router;