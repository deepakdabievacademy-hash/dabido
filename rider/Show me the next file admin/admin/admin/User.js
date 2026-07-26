const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        default: ""
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["User", "Rider", "Admin"],
        default: "User"
    },

    vehicleType: {
        type: String,
        default: ""
    },

    vehicleNumber: {
        type: String,
        default: ""
    },

    licenseNumber: {
        type: String,
        default: ""
    },

    online: {
        type: Boolean,
        default: false
    },

    approved: {
        type: Boolean,
        default: true
    },

    rating: {
        type: Number,
        default: 5
    },

    totalRides: {
        type: Number,
        default: 0
    },

    totalEarnings: {
        type: Number,
        default: 0
    },

    wallet: {
        type: Number,
        default: 0
    },

    location: {

        latitude: {
            type: Number,
            default: 0
        },

        longitude: {
            type: Number,
            default: 0
        }

    },

    profileImage: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

// Password Hash
UserSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();

});

// Compare Password
UserSchema.methods.matchPassword = async function(password){

    return await bcrypt.compare(password, this.password);

};

module.exports = mongoose.model("User", UserSchema);
