const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    created
},{ 
    timestamps: true
});

module.exports = mongoose.model("Task", TaskSchema);
