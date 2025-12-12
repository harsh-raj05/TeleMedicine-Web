const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Telemedicine Backend API Running");
});

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

app.use("/api/records", require("./routes/medicalRecordRoutes"));



app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
