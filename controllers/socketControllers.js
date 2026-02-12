
const Stations = require('../models/stationModel');
const Socket = require('../models/socketModel');



// add Station's Socket 
exports.registerNewSocket = async (req, res) => {
    // console.log(req.body);

    const { stationId, powerType, connectorType, pricePerHour } = req.body;

    // const station = await Stations.findById(stationId);


    const ownerId = req.userID;
    console.log(ownerId);

    // console.log(stationName);



    try {
        const socketCount = await Socket.countDocuments({ stationId });

        const isBackupSocket = socketCount === 0;

        if (isBackupSocket) {
            const newBackupSocket = new Socket({
                stationId,
                powerType,
                connectorType,
                pricePerHour,
                status: "BACKUP"
            });

            await newBackupSocket.save();
        }
        else {
            const newSocket = new Socket({
                stationId,
                powerType,
                connectorType,
                pricePerHour
            });

            await newSocket.save();
        }

        res.status(201).json({
            message: isBackupSocket
                ? "Backup socket added successfully"
                : "Socket added successfully"
        });

    } catch (err) {
        console.error("Add Socket Error:", err);
        res.status(500).json({
            message: "Error adding socket",
            error: err.message
        });
    }

};


// get View Stations for the logged-in Owner
exports.getStationSockets = async (req, res) => {
    // Debug log to ensure user ID is being passed from JWT middleware
    const {stationId} = req.body
    console.log("Owner ID from JWT:", stationId); 

    try {
        // 1. Fetch stations where ownerId matches the ID from the JWT
        // 2. We filter by ownerId: req.user.id
        const viewSockets = await Socket.find({ 
            stationId: stationId
        })
        console.log(viewSockets);
        
        // If the array is empty, it means no stations are registered for this user
        if (!viewSockets || viewSockets.length === 0) {
            return res.status(404).json({ message: "No sockets found for this stations." });
        }

        res.status(200).json(viewSockets);

    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};