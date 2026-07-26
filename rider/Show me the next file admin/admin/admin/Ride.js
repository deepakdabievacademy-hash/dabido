const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    pickup: {
        address: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },

    destination: {
        address: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },

    vehicleType: {
        type: String,
        enum: ["Bike", "Auto", "Cab"],
        required: true
    },

    fare: {
        type: Number,
        required: true
    },

    distance: {
        type: Number,
        default: 0
    },

    duration: {
        type: Number,
        default: 0
    },

    paymentMethod: {
        type: String,
        enum: ["Cash", "UPI", "Card", "Wallet"],
        default: "Cash"
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Accepted",
            "Arriving",
            "Started",
            "Completed",
            "Cancelled"
        ],
        default: "Pending"
    },

    otp: {
        type: String,
        default: ""
    },

    userRating: {
        type: Number,
        default: 0
    },

    riderRating: {
        type: Number,
        default: 0
    },

    review: {
        type: String,
        default: ""
    },

    cancelledBy: {
        type: String,
        default: ""
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Ride", RideSchema);
