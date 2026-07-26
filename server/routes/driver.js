const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Driver = require("../models/Driver");
const auth = require("../middleware/auth");

const router = express.Router();

/*
========================
Register Driver
POST /api/drivers/register
========================
*/
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      vehicleType,
      vehicleNumber,
      licenseNumber
    } = req.body;

    const exists = await Driver.findOne({
      $or: [{ email }, { phone }]
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Driver already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      email,
      phone,
      password: hash,
      vehicleType,
      vehicleNumber,
      licenseNumber
    });

    const token = jwt.sign(
      {
        id: driver._id,
        role: "driver"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(201).json({
      success: true,
      message: "Driver registered successfully",
      token,
      driver
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
=====================
Driver Login
POST /api/drivers/login
=====================
*/
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    const match = await bcrypt.compare(
      password,
      driver.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password"
      });
    }

    const token = jwt.sign(
      {
        id: driver._id,
        role: "driver"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      token,
      driver
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

/*
==========================
Update Online Status
PUT /api/drivers/status
==========================
*/
router.put("/status", auth, async (req, res) => {

  try {

    const { online } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.user._id,
      { online },
      { new: true }
    );

    res.json({
      success: true,
      driver
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

/*
============================
Update Driver Location
PUT /api/drivers/location
============================
*/
router.put("/location", auth, async (req, res) => {

  try {

    const { lat, lng } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.user._id,
      {
        currentLocation: {
          lat,
          lng
        }
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      driver
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

module.exports = router;
