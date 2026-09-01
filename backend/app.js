const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const userService = require("./services/userService");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const materialRoutes = require("./routes/materialRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());    // Enable CORS for all routes

// http://localhost:3000/api/users/*
app.use("/api/users",userRoutes);

// http://localhost:3000/api/courses/*
app.use("/api/courses",courseRoutes);

// http://localhost:3000/api/enrollments/*
app.use("/api/enrollments",enrollmentRoutes);

// http://localhost:3000/api/materials/*
app.use("/api/materials",materialRoutes);

// http://localhost:3000/api/feedbacks/*
app.use("/api/feedbacks",feedbackRoutes);

// http://localhost:3000/api/chats/*
app.use("/api/chats",chatRoutes);

userService.createAdminUser("admin@gmail.com","admin@123","admin");
app.listen(3000, () => {
    console.log("Server Running On Port 3000");
});