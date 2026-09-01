const mongoose = require("mongoose");
mongoose.pluralize(null);
const lessonSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["text", "video"],
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    gridFsFileId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    fileName: {
        type: String,
        default: null
    },
    mimeType: {
        type: String,
        default: null
    },
    fileSize: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

lessonSchema.index({ chapterId: 1, order: 1 });
lessonSchema.index({ courseId: 1 });

module.exports = mongoose.model("Lesson", lessonSchema);