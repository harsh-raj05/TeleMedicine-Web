import { useState } from "react";
import api from "../services/api";

function UploadRecord() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("record", file);

    try {
      await api.post("/medical/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      alert("Record uploaded successfully!");
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">

      <div className="bg-white p-8 shadow rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Upload Medical Record</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default UploadRecord;
