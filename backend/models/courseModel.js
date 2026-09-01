const mongoose = require("mongoose");
mongoose.pluralize(null);
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Course", courseSchema);