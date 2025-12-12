import { useEffect, useState } from "react";
import api from "../services/api";

function ViewRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const res = await api.get("/medical/my-records");
      setRecords(res.data);
    };
    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">My Medical Records</h2>

      <div className="grid gap-4">
        {records.map((r) => (
          <div key={r._id} className="bg-white p-4 shadow rounded">

            <p className="font-bold">{r.fileName}</p>
            <p className="text-gray-500 text-sm">
              Uploaded: {new Date(r.uploadedAt).toLocaleString()}
            </p>

            <a
              href={`http://localhost:5000/${r.filePath}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewRecords;
