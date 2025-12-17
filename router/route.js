    //1 import express
    const express = require('express')


    const userControllers = require('../controllers/userControllers')

    const router = express.Router()

    //Register user
    router.post('/api/register',userControllers.registerUser)

    //login user
    router.post('/api/login',userControllers.loginUser)

    module.exports = router;