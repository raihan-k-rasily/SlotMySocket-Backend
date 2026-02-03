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


// get View Stations for the logged-in Owner
exports.getViewOwnerStations = async (req, res) => {
    // Debug log to ensure user ID is being passed from JWT middleware
    console.log("Owner ID from JWT:", req.userID); 

    try {
        // 1. Fetch stations where ownerId matches the ID from the JWT
        // 2. We filter by ownerId: req.user.id
        const viewStations = await Stations.find({ 
            ownerId: req.userID
        })
        console.log(viewStations);
        
        // If the array is empty, it means no stations are registered for this user
        if (!viewStations || viewStations.length === 0) {
            return res.status(404).json({ message: "No stations found for this owner." });
        }

        res.status(200).json(viewStations);

    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// add Owner Stations for the logged-in Owner
exports.registerNewStationByOwner = async (req, res) => {
    const { stationName, latitude, longitude, openingAt, closingAt } = req.body;
    const ownerId = req.userID; // Taken from your JWT middleware

    try {
        // 1. Check if station already exists at these coordinates
        const existingStation = await Stations.findOne({
            "location.latitude": parseFloat(latitude),
            "location.longitude": parseFloat(longitude)
        });

        if (existingStation) {
            return res.status(409).json({ message: "A station is already registered at this location." });
        }

        // 2. Fetch Address from OSM (Logic reused from your previous code)
        let address = "Address not found";
        try {
            const osmResponse = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`,
                { headers: { 'User-Agent': 'SlotMySocket-App' }, timeout: 5000 }
            );
            if (osmResponse.data && osmResponse.data.address) {
                const addr = osmResponse.data.address;
                const parts = [
                    addr.road || addr.suburb || "",
                    addr.city || addr.town || addr.village || "",
                    addr.state || "",
                    addr.postcode || ""
                ];
                address = parts.filter(p => p !== "").join(", ");
            }
        } catch (osmErr) {
            address = `Lat: ${latitude}, Lon: ${longitude}`;
        }

        // 3. Create the Station
        const newStation = new Stations({
            stationName,
            ownerId: ownerId,
            location: {
                address: address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
            workingHours: {
                openingAt: openingAt,
                closingAt: closingAt
            },
            status: "PENDING" // Requires Admin Approval
        });

        await newStation.save();
        res.status(201).json({ message: "Station registered successfully. Awaiting approval.", station: newStation });

    } catch (err) {
        res.status(500).json({ message: 'Error registering station', error: err.message });
    }
}


// add Owner Stations for the logged-in Owner
exports.registerNewStationByOwner1 = async (req, res) => {
    const { stationName, latitude, longitude, openingAt, closingAt } = req.body;
    const ownerId = req.userID; // Taken from your JWT middleware

    try {
        // 1. Check if station already exists at these coordinates
        const existingStation = await Stations.findOne({
            "location.latitude": parseFloat(latitude),
            "location.longitude": parseFloat(longitude)
        });

        if (existingStation) {
            return res.status(409).json({ message: "A station is already registered at this location." });
        }

        // 2. Fetch Address from OSM (Logic reused from your previous code)
        let address = "Address not found";
        try {
            const osmResponse = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`,
                { headers: { 'User-Agent': 'SlotMySocket-App' }, timeout: 5000 }
            );
            if (osmResponse.data && osmResponse.data.address) {
                const addr = osmResponse.data.address;
                const parts = [
                    addr.road || addr.suburb || "",
                    addr.city || addr.town || addr.village || "",
                    addr.state || "",
                    addr.postcode || ""
                ];
                address = parts.filter(p => p !== "").join(", ");
            }
        } catch (osmErr) {
            address = `Lat: ${latitude}, Lon: ${longitude}`;
        }

        // 3. Create the Station
        const newStation = new Stations({
            stationName,
            ownerId: ownerId,
            location: {
                address: address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
            workingHours: {
                openingAt: openingAt,
                closingAt: closingAt
            },
            status: "PENDING" // Requires Admin Approval
        });

        await newStation.save();
        res.status(201).json({ message: "Station registered successfully. Awaiting approval.", station: newStation });

    } catch (err) {
        res.status(500).json({ message: 'Error registering station', error: err.message });
    }
}
