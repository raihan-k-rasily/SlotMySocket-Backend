const mongoose = require("mongoose");

const socketSchema = new mongoose.Schema({

    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        required: true
    },

    /* 
      socketName: {
        type: String,
        required: true,
        trim: true
      },
    
        socketNumber: {
        type: Number,
        required: true
      },
      isBackup: {
        type: Boolean,
        default: false
      },
    
      isActive: {
        type: Boolean,
        default: true
      },
      
    */

    powerType: {
        type: String,
        enum: ["AC", "DC"],
        default: "AC"
    },

    connectorType: {
        type: String,
        enum: ["Type1", "Type2", "CCS", "CHAdeMO", "GB/T"],
        default: "Type2"
    },

    pricePerHour: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED', 'UNDER_MAINTENANCE', 'PENDING', 'BACKUP'],
        default: 'OPEN'
    }


});

module.exports = mongoose.model("Socket", socketSchema);
