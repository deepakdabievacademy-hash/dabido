const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// =============================
// Generate JWT Token
// =============================

function generateToken(userId){

    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || "dabido_secret",
        {
            expiresIn: "7d"
        }
    );

}

// =============================
// Register User / Rider
// =============================

router.post("/register", async (req, res) => {

    try{

        const {

            name,
            phone,
            email,
            password,
            role,
            vehicleType,
            vehicleNumber,
            licenseNumber

        } = req.body;

        if(!name || !phone || !password){

            return res.status(400).json({

                success:false,
                message:"Please fill all required fields"

            });

        }

        const exists = await User.findOne({ phone });

        if(exists){

            return res.status(400).json({

                success:false,
                message:"Phone number already registered"

            });

        }

        const user = new User({

            name,
            phone,
            email,
            password,
            role: role || "User",
            vehicleType,
            vehicleNumber,
            licenseNumber

        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({

            success:true,

            message:"Registration Successful",

            token,

            user:{

                id:user._id,
                name:user.name,
                phone:user.phone,
                email:user.email,
                role:user.role

            }

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Server Error"

        });
        

    }
    const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// =============================
// Generate JWT Token
// =============================

function generateToken(userId){

    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || "dabido_secret",
        {
            expiresIn: "7d"
        }
    );

}

// =============================
// Register User / Rider
// =============================

router.post("/register", async (req, res) => {

    try{

        const {

            name,
            phone,
            email,
            password,
            role,
            vehicleType,
            vehicleNumber,
            licenseNumber

        } = req.body;

        if(!name || !phone || !password){

            return res.status(400).json({

                success:false,
                message:"Please fill all required fields"

            });

        }

        const exists = await User.findOne({ phone });

        if(exists){

            return res.status(400).json({

                success:false,
                message:"Phone number already registered"

            });

        }

        const user = new User({

            name,
            phone,
            email,
            password,
            role: role || "User",
            vehicleType,
            vehicleNumber,
            licenseNumber

        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({

            success:true,

            message:"Registration Successful",

            token,

            user:{

                id:user._id,
                name:user.name,
                phone:user.phone,
                email:user.email,
                role:user.role

            }

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

});

});
const auth = require("../middleware/auth");

// =============================
// Get Profile
// =============================

router.get("/profile", auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.json({
            success: true,
            user
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

// =============================
// Update Profile
// =============================

router.put("/profile", auth, async (req, res) => {

    try {

        const {

            name,
            email,
            vehicleType,
            vehicleNumber,
            licenseNumber

        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        if (name) user.name = name;
        if (email) user.email = email;

        if (user.role === "Rider") {

            if (vehicleType) user.vehicleType = vehicleType;
            if (vehicleNumber) user.vehicleNumber = vehicleNumber;
            if (licenseNumber) user.licenseNumber = licenseNumber;

        }

        await user.save();

        res.json({

            success: true,
            message: "Profile Updated Successfully",
            user

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

});

// =============================
// Change Password
// =============================

router.put("/change-password", auth, async (req, res) => {

    try {

        const {

            oldPassword,
            newPassword

        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        const match = await user.matchPassword(oldPassword);

        if (!match) {

            return res.status(400).json({

                success: false,
                message: "Old password is incorrect"

            });

        }

        user.password = newPassword;

        await user.save();

        res.json({

            success: true,
            message: "Password Changed Successfully"

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

});

// =============================
// Export Router
// =============================

module.exports = router;
