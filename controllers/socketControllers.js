const { ifError } = require('assert/strict');
const Sockets = require('../models/socketModel');


// add Owner Stations for the logged-in Owner
exports.registerNewSocket = async (req, res) => {
    // console.log(req.body);

    const { stationId, powerType, connectorType, pricePerHour } = req.body;

    const station = await Stations.findById(stationId);


    const ownerId = req.userID;
    console.log(ownerId);

    console.log(stationName);



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
                : "Socket added successfully",
            socket: newSocket
        });

    } catch (err) {
        console.error("Add Socket Error:", err);
        res.status(500).json({
            message: "Error adding socket",
            error: err.message
        });
    }

};
