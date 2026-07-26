const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null
    },

    pickup: {
      address: String,
      lat: Number,
      lng: Number
    },

    destination: {
      address: String,
      lat: Number,
      lng: Number
    },

    vehicleType: {
      type: String,
      enum: ["Bike", "Auto", "Cab"],
      default: "Bike"
    },

    fare: {
      type: Number,
      default: 0
    },

    distance: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Started",
        "Completed",
        "Cancelled"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Ride", rideSchema);
