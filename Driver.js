const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    vehicleType: {
      type: String,
      enum: ["Bike", "Auto", "Cab"],
      default: "Bike"
    },

    vehicleNumber: {
      type: String,
      required: true
    },

    licenseNumber: {
      type: String,
      required: true
    },

    online: {
      type: Boolean,
      default: false
    },

    currentLocation: {
      lat: {
        type: Number,
        default: 0
      },
      lng: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Driver", driverSchema);
