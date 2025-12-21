const Stations = require('../models/stationModel');
const Users = require('../models/userModel');

exports.getPendingStations = async (req, res) => {
    try {
        // 1. Find all stations where status is PENDING
        // 2. .populate('ownerId') fetches the full User object for each station
        const pendingRequests = await Stations.find({ status: "PENDING" })
            .populate('ownerId', 'username email status'); // Only fetch specific owner fields

        console.log("Pending Station Requests:", pendingRequests);

        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error("Error fetching pending stations:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};