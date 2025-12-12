import { useState } from "react";
import api from "../services/api";

function UploadRecord() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const handleUpload = async () => {
    // Step 1: Upload file to Cloudinary or backend
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await api.post("/upload-file", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // Step 2: save record info in MongoDB
    await api.post("/records/upload", {
      patient: user.id,
      title,
      fileUrl: uploadRes.data.url
    });

    alert("Record uploaded!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Medical Record</h1>

      <input
        type="text"
        placeholder="Record Title"
        className="w-full border p-2 mb-3"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        className="w-full border p-2 mb-3"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Upload
      </button>
    </div>
  );
}

export default UploadRecord;
