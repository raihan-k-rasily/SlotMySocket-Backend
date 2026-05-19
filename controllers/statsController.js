const Booking = require("../models/bookingModel");
const Station = require("../models/stationModel");
const User = require("../models/userModel");
const Socket = require("../models/socketModel");

exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "User" });
        const totalOwners = await User.countDocuments({ role: "Owner" });
        const totalStations = await Station.countDocuments();
        const totalBookings = await Booking.countDocuments({ status: "CONFIRMED" });

        res.status(200).json({
            totalUsers,
            totalOwners,
            totalStations,
            totalBookings
        });
    } catch (err) {
        console.error("Admin stats error:", err);
        res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
};

exports.getOwnerStats = async (req, res) => {
    try {
        const ownerId = req.userId;

        // Find all stations owned by this owner
        const ownerStations = await Station.find({ ownerId });
        const stationIds = ownerStations.map(s => s._id);

        const totalStations = ownerStations.length;
        
        // Find all bookings for these stations
        const totalBookings = await Booking.countDocuments({
            stationId: { $in: stationIds },
            status: "CONFIRMED"
        });

        // Today's bookings
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = await Booking.countDocuments({
            stationId: { $in: stationIds },
            date: today,
            status: "CONFIRMED"
        });

        // Total Earnings (this is a bit more complex as we need to join with Socket price)
        const bookingsWithSockets = await Booking.find({
            stationId: { $in: stationIds },
            status: "CONFIRMED"
        }).populate("socketId");

        const totalEarnings = bookingsWithSockets.reduce((sum, booking) => {
            return sum + (booking.socketId?.pricePerHour || 0);
        }, 0);

        res.status(200).json({
            totalStations,
            totalBookings,
            todayBookings,
            totalEarnings
        });
    } catch (err) {
        console.error("Owner stats error:", err);
        res.status(500).json({ message: "Failed to fetch owner statistics" });
    }
};
