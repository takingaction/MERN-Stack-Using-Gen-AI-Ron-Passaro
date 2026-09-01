const mongoose = require("mongoose");
mongoose.pluralize(null);

const enrollmentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    instructorEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    },
    processedBy: {
        type: String
    }
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
