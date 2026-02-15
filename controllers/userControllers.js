const Users = require('../models/userModel');
const Stations = require('../models/stationModel'); // Assuming you created this model
const jwt = require('jsonwebtoken');
const axios = require('axios'); // You'll need axios for the address lookup

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
// login user
exports.loginUser = async (req, res) => {
    console.log('Inside Login User');
    console.log(req.body);
    const { email, password } = req.body
    try {
        const existingUser = await Users.findOne({ email })
        if (existingUser) {

            if (existingUser.password == password) {
                // token genaration
                const token = jwt.sign({userId: existingUser._id, username: existingUser.username, usermail: existingUser.email, role: existingUser.role }, process.env.jwtKey)

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


// google login user
exports.googleAuth = async (req, res) => {
    console.log("inside google Login user");
    const { email, password, username, profile, role } = req.body

    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            // token genaration 
            const token = jwt.sign({userId: existingUser._id, usermail: existingUser.email, role: existingUser.role }, process.env.jwtKey)
            console.log(token);
            res.status(200).json({ message: "Login Sucecessful", user: existingUser, token })

        } else {
            // else create  new user
            const status = "ACTIVE"
            const newUser = new Users({ username, email, password, role, status, profile })
            await newUser.save(); // save to  database 
            // token genaration
            const token = jwt.sign({userId: existingUser._id, usermail: newUser.email, role: newUser.role }, process.env.jwtKey)
            console.log(token);
            res.status(201).json({ message: "login sucecessful", user: newUser, token });// second created user as response

        }
    } catch (error) {
        res.status(500).json({ message: "Error registering User", error: error.message })

    }

}

// register Owner
exports.registerOwner = async (req, res) => {
    console.log('Inside Register Owner');
    const { username, email, password, stationName, latitude, longitude, role } = req.body;

    try {
        // 1. Check if user already exists by EMAIL
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "User already exists with this email" });
        }

        // 2. CHECK IF STATION ALREADY EXISTS AT THESE COORDINATES
        // We parse to Float to match the database number format exactly
        const existingStation = await Stations.findOne({
            "location.latitude": parseFloat(latitude),
            "location.longitude": parseFloat(longitude)
        });

        if (existingStation) {
            return res.status(409).json({
                message: "A station is already registered at this exact location."
            });
        }

        // 3. GET ADDRESS FROM COORDINATES (OpenStreetMap)
        // 2. GET ADDRESS FROM COORDINATES (Global & Robust)
        let address = "Address not found";

        try {
            const osmResponse = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`,
                {
                    headers: { 'User-Agent': 'SlotMySocket-App' },
                    timeout: 5000 // Prevents the server from hanging if OSM is slow
                }
            );

            if (osmResponse.data && osmResponse.data.address) {
                const addr = osmResponse.data.address;

                // Create an array of potential address parts (works globally)
                const parts = [
                    addr.road || addr.suburb || "",
                    addr.city || addr.town || addr.village || "",
                    addr.state || addr.region || "",
                    addr.postcode || "",
                    addr.country || ""
                ];

                // Clean up: Filter out empty strings and join with a comma
                address = parts.filter(p => p !== "").join(", ");
            } else {
                // Fallback if OSM returns an empty result
                address = `Station at ${latitude}, ${longitude}`;
            }

        } catch (osmErr) {
            console.error("OSM Lookup failed:", osmErr.message);
            // Best practice: save coordinates as address so the record isn't "blank"
            address = `Lat: ${latitude}, Lon: ${longitude}`;
        }

        // 4. CREATE NEW USER (Owner)
        const newUser = new Users({
            username, email, password, role: 'Owner', status: "ACTIVE"
        });
        const savedUser = await newUser.save();

        // 5. CREATE THE STATION linked to this Owner
        const newStation = new Stations({
            stationName,
            ownerId: savedUser._id,
            location: {
                address: address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
            status: "PENDING" // As you requested: Admin must approve
        });
        await newStation.save();

        const token = jwt.sign(
            { usermail: savedUser.email, role: savedUser.role },
            process.env.jwtKey
        );

        res.status(201).json({
            message: "Registration pending admin approval",
            user: savedUser,
            token
        });

    } catch (err) {
        res.status(500).json({ message: 'Error registering owner', error: err.message });
    }
}

// Get all registered users (excluding Admins)
exports.getAllUsers = async (req, res) => {
    try {
        // Find users where role is 'User' (or simply all if you prefer)
        console.log("get All Users");
        
        const allUsers = await Users.find({ role: "User" });
        
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// update User Status

// userController.js or adminController.js

exports.updateUsersStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    
    try {
        const updatedUser = await Users.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json("User not found");
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
};
