import { useState, useRef, useEffect } from "react";
import { X, Upload, Camera, Save, Loader2 } from "lucide-react";
import api from "../services/api";

function EditProfileModal({ isOpen, onClose, user, onProfileUpdate }) {
    const [form, setForm] = useState({
        contactNumber: "",
        degreeQualification: "",
        workingExperience: ""
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setForm({
                contactNumber: user.contactNumber || "",
                degreeQualification: user.degreeQualification || "",
                workingExperience: user.workingExperience || ""
            });
            if (user.profilePicture) {
                setPreviewUrl(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profilePicture}`);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadPicture = async () => {
        if (!profilePicture) return;

        setUploadingPicture(true);
        try {
            const formData = new FormData();
            formData.append("profilePicture", profilePicture);

            const res = await api.post("/profile/upload-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            // Update local storage with new user data
            const updatedUser = res.data.user;
            localStorage.setItem("user", JSON.stringify(updatedUser));
            onProfileUpdate(updatedUser);
            setProfilePicture(null);
            alert("Profile picture uploaded successfully!");
        } catch (err) {
            console.error("Error uploading picture:", err);
            alert(err.response?.data?.message || "Error uploading profile picture");
        } finally {
            setUploadingPicture(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload picture first if selected
            if (profilePicture) {
                await handleUploadPicture();
            }

            // Update profile data
            const res = await api.put("/profile/update", form);
            const updatedUser = res.data.user;

            // Update local storage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            onProfileUpdate(updatedUser);

            alert("Profile updated successfully!");
            onClose();
        } catch (err) {
            console.error("Error updating profile:", err);
            alert(err.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-100">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Camera size={32} />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg"
                            >
                                <Upload size={14} />
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <p className="text-sm text-gray-500 mt-2">Click to upload profile picture</p>
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            📞 Contact Number
                        </label>
                        <input
                            name="contactNumber"
                            type="tel"
                            value={form.contactNumber}
                            onChange={handleChange}
                            placeholder="Enter your contact number"
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Degree Qualification */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            🎓 Degree Qualification
                        </label>
                        <input
                            name="degreeQualification"
                            type="text"
                            value={form.degreeQualification}
                            onChange={handleChange}
                            placeholder="e.g., MBBS, MD, MS"
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Working Experience */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            💼 Working Experience
                        </label>
                        <input
                            name="workingExperience"
                            type="text"
                            value={form.workingExperience}
                            onChange={handleChange}
                            placeholder="e.g., 10 years"
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
