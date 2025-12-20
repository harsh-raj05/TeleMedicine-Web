const Chat = require("../models/Chat");
const mongoose = require("mongoose");

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        const messages = await Chat.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        }).sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching chat history" });
    }
};


// Mark messages as read
exports.markAsRead = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        await Chat.updateMany(
            { sender: senderId, receiver: receiverId, read: false },
            { $set: { read: true } }
        );

        res.json({ message: "Messages marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Error updating read status" });
    }
};

// Get unread message counts for a user
exports.getUnreadCounts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Aggregate unread messages grouped by sender
        const unreadCounts = await Chat.aggregate([
            {
                $match: {
                    receiver: new mongoose.Types.ObjectId(userId),
                    read: false
                }
            },
            {
                $group: {
                    _id: "$sender",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert array to object { senderId: count }
        const counts = {};
        unreadCounts.forEach(item => {
            counts[item._id] = item.count;
        });

        res.json(counts);
    } catch (err) {
        console.error("Error fetching unread counts:", err);
        res.status(500).json({ message: "Error fetching unread counts" });
    }
};
