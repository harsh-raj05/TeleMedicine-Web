const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const chatController = require("../controllers/chatController");

const upload = require("../middleware/uploadMiddleware");

router.get("/history/:userId1/:userId2", auth, chatController.getChatHistory);
router.put("/read", auth, chatController.markAsRead);
router.get("/unread/:userId", auth, chatController.getUnreadCounts);

// Upload File Route
router.post("/upload", auth, upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Return relative path
        const fileUrl = `/uploads/chat/${req.file.filename}`;
        res.json({ fileUrl, fileType: req.file.mimetype.startsWith("image") ? "image" : "file" });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "File upload failed" });
    }
});

module.exports = router;
