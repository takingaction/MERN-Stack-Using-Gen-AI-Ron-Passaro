const mongoose = require("mongoose");

const connectDB = async () => {

    try {

        await mongoose.connect(
            "mongodb://127.0.0.1:27017/capstoneProjectDB",
        );

        console.log("MongoDB Connected");

    } catch (error) {

        console.log(error.message);
    }
};

const getDb = () => {
    if (!mongoose.connection.db) {
        throw new Error("Database not connected yet");
    }
    return mongoose.connection.db;
};

module.exports = connectDB;
module.exports.getDb = getDb;