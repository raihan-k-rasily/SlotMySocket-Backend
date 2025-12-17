const Users = require('../models/userModel');
const jwt = require('jsonwebtoken')
// register user - creat - post (username,email,password) request body

exports.registerUser = async (req, res) => {
    console.log('inside register user');
    console.log(req.body);//{username: '...', email: '...' , password:'..'}
    const { username, email, password, role } = req.body; //  destructring
    try {
        // check if user already exits with same email
        const existingUser = await Users.findOne({ email })
        //if user exists , send error response 

        if (existingUser) {
            res.status(401).json({ message: "User already exists whith this email" })

        } else {
            // else create new user
            const status = "ACTIVE"
            const newUser = new Users({ username, email, password, role, status })
            await newUser.save(); // save to mongodb
            res.status(201).json(newUser)// send created user as response
        }

    }
    catch (err) {
        res.status(500).json({ message: 'Error registering', error: err.message });
    }

}

exports.loginUser = async (req, res) => {
    console.log('Inside Login User');
    console.log(req.body);
    const { email, password } = req.body
    try {
        const existingUser = await Users.findOne({ email })
        if (existingUser) {

            if (existingUser.password == password) {
                // token genaration
                const token = jwt.sign({ usermail: existingUser.email, role: existingUser.role }, process.env.jwtKey)

                res.status(201).json({ message: "Login successful", user: existingUser, token })
            } else {
                res.status(401).json({ message: "inavalid password" })
            }
        } else {
            res.status(401).json({ message: "User not found" })

        }
    } catch (err) {
        res.status(500).json({ message: "Error Login user", error: err.message })
    }


}
