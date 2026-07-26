const express = require("express");
const Ride = require("../models/Ride");
const Driver = require("../models/Driver");
const auth = require("../middleware/auth");

const router = express.Router();

/*
========================
Book Ride
POST /api/rides/book
========================
*/
router.post("/book", auth, async (req, res) => {
  try {
    const {
      pickup,
      destination,
      vehicleType,
      fare,
      distance
    } = req.body;

    const ride = await Ride.create({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
      fare,
      distance
    });

    res.status(201).json({
      success: true,
      message: "Ride booked successfully",
      ride
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

/*
========================
Get All Rides
GET /api/rides
========================
*/
router.get("/", auth, async (req, res) => {
  try {

    const rides = await Ride.find()
      .populate("user", "name phone")
      .populate("driver", "name phone vehicleType");

    res.json({
      success: true,
      rides
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
});

/*
========================
Accept Ride
PUT /api/rides/:id/accept
========================
*/
router.put("/:id/accept", auth, async (req, res) => {

  try {

    const driver = await Driver.findById(req.user._id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        driver: driver._id,
        status: "Accepted"
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Ride Accepted",
      ride
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

/*
========================
Start Ride
PUT /api/rides/:id/start
========================
*/
router.put("/:id/start", auth, async (req, res) => {

  try {

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        status: "Started"
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Ride Started",
      ride
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

/*
========================
Complete Ride
PUT /api/rides/:id/complete
========================
*/
router.put("/:id/complete", auth, async (req, res) => {

  try {

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        status: "Completed"
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Ride Completed",
      ride
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

/*
========================
Cancel Ride
PUT /api/rides/:id/cancel
========================
*/
router.put("/:id/cancel", auth, async (req, res) => {

  try {

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        status: "Cancelled"
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Ride Cancelled",
      ride
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

/*
========================
My Ride History
GET /api/rides/history
========================
*/
router.get("/history", auth, async (req, res) => {

  try {

    const rides = await Ride.find({
      user: req.user._id
    })
      .populate("driver", "name phone vehicleType")
      .sort({
        createdAt: -1
      });

    res.json({
      success: true,
      count: rides.length,
      rides
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

module.exports = router;
