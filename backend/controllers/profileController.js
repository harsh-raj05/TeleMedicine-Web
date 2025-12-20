const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { contactNumber, degreeQualification, workingExperience } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields if provided
        if (contactNumber !== undefined) user.contactNumber = contactNumber;
        if (degreeQualification !== undefined) user.degreeQualification = degreeQualification;
        if (workingExperience !== undefined) user.workingExperience = workingExperience;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                specialization: user.specialization,
                contactNumber: user.contactNumber,
                degreeQualification: user.degreeQualification,
                workingExperience: user.workingExperience,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Error updating profile" });
    }
};

// UPLOAD PROFILE PICTURE
exports.uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete old profile picture if exists
        if (user.profilePicture) {
            const oldPath = path.join(__dirname, "..", user.profilePicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Save new profile picture path
        user.profilePicture = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({
            message: "Profile picture uploaded successfully",
            profilePicture: user.profilePicture,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                specialization: user.specialization,
                contactNumber: user.contactNumber,
                degreeQualification: user.degreeQualification,
                workingExperience: user.workingExperience,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.error("Error uploading profile picture:", err);
        res.status(500).json({ message: "Error uploading profile picture" });
    }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                specialization: user.specialization,
                contactNumber: user.contactNumber,
                degreeQualification: user.degreeQualification,
                workingExperience: user.workingExperience,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: "Error fetching profile" });
    }
};
