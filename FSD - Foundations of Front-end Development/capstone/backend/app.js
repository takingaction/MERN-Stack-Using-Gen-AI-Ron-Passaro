const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const userService = require("./services/userService");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(cors());    // Enable CORS for all routes

// http://localhost:3000/api/users/*
app.use("/api/users",userRoutes);

// http://localhost:3000/api/courses/*
app.use("/api/courses",courseRoutes);

userService.createAdminUser("admin@gmail.com","admin@123","admin");
app.listen(3000, () => {
    console.log("Server Running On Port 3000");
});