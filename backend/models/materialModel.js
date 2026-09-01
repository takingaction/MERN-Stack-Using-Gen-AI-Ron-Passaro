const mongoose = require("mongoose");
mongoose.pluralize(null);

const materialSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ["video", "document", "presentation"],
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    gridFsFileId: {
        type: mongoose.Schema.Types.ObjectId
    },
    data: {
        type: Buffer
    },
    uploadedBy: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Material", materialSchema);
