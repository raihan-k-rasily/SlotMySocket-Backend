const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    stationName: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Links to your user model
        required: true
    },
    location: {
        address: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    images: [{
        type: String // URLs of station photos
    }],
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED', 'UNDER_MAINTENANCE', 'PENDING'],
        default: 'PENDING'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('station', stationSchema);