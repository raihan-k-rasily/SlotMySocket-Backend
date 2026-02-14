const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "station",
    required: true
  },

  socketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Socket",
    required: true
  },

  date: {
    type: String, // "YYYY-MM-DD"
    required: true
  },

  startTime: {
    type: String, // "10:00"
    required: true
  },

  endTime: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
    default: "CONFIRMED"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
