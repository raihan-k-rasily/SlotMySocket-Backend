const Booking = require('../models/bookingModel');

exports.createBooking = async (req, res) => {
  try {
    const { stationId, socketId, date, startTime, endTime } = req.body;

    const newBooking = new Booking({
      userId: req.userId, // from JWT middleware
      stationId,
      socketId,
      date,
      startTime,
      endTime
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking confirmed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};
