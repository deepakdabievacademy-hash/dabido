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
