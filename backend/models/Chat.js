const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    fileUrl: {
        type: String,
        default: ""
    },
    fileType: {
        type: String, // 'text', 'image', 'file'
        default: "text"
    }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
