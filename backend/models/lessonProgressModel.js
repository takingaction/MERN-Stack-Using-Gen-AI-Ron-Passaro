const mongoose = require("mongoose");
mongoose.pluralize(null);

const lessonProgressSchema = new mongoose.Schema({
    studentEmail: {
        type: String,
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

lessonProgressSchema.index({ studentEmail: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ studentEmail: 1, courseId: 1 });

module.exports = mongoose.model("LessonProgress", lessonProgressSchema);