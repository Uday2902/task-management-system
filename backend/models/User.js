const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pendingTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    inProgressTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    completedTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ]
},{
    timestamps: true
});

UserSchema.pre("save", async (next) => {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); 
    next();
});

UserSchema.methods.createJWT = (req, res) => {
    return jwt.sign(
        { mongoID: this._id, email: this.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_LIFETIME }

    )
};

UserSchema.methods.comparePassword = async (userPassword) => {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
