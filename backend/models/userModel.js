const mongoose = require("mongoose");
mongoose.pluralize(null);
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    typeOfUser: {
        type: String,
        enum: ["admin", "student", "instructor"],
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);