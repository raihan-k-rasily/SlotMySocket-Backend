const Stations = require('../models/stationModel');
const Users = require('../models/userModel');

// get Pending Stations
exports.getPendingStations = async (req, res) => {
    console.log("Admin Request Received at /admin/pending-stations"); // Debug log 1

    try {
        // 1. Fetch stations with PENDING status
        // 2. Populate owner details (Username, Email, Status)
        const pendingRequests = await Stations.find({ status: "PENDING" })
            .populate({
                path: 'ownerId',
                select: 'username email status'
            });

        if (!pendingRequests) {
            return res.status(404).json({ message: "No stations found collection" });
        }

        console.log(`Found ${pendingRequests.length} pending stations.`); // Debug log 2
        res.status(200).json(pendingRequests);

    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// update Station Status
 
exports.updateStationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expecting "APPROVED" or "REJECTED"

    try {
        const updatedStation = await Stations.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );
        res.status(200).json(updatedStation);
    } catch (error) {
        res.status(500).json({ message: "Failed to update status", error });
    }
};

// get View Stations
exports.getViewStations = async (req, res) => {
    console.log("Admin Request Received at /admin/View-stations"); // Debug log 1

    try {
        // 1. Fetch stations with View status
        // 2. Populate owner details (Username, Email, Status)
        const viewStations = await Stations.find({ status: { $ne: "PENDING" } })
            .populate({
                path: 'ownerId',
                select: 'username email status'
            });

        if (!viewStations) {
            return res.status(404).json({ message: "No stations found collection" });
        }

        // console.log(`Found ${viewStations.length} pending stations.`); // Debug log 2
        res.status(200).json(viewStations);

    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// get View Stations
exports.getOwnerViewStations = async (req, res) => {
    console.log("Admin Request Received at /admin/View-stations"); // Debug log 1

    try {
        // 1. Fetch stations with View status
        // 2. Populate owner details (Username, Email, Status)
        const viewStations = await Stations.find({ status: { $ne: "PENDING" } })
            .populate({
                path: 'ownerId',
                select: 'username email status'
            });

        if (!viewStations) {
            return res.status(404).json({ message: "No stations found collection" });
        }

        // console.log(`Found ${viewStations.length} pending stations.`); // Debug log 2
        res.status(200).json(viewStations);

    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
