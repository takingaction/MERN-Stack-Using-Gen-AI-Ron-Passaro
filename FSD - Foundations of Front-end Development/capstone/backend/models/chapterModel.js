const mongoose = require("mongoose");
mongoose.pluralize(null);
const chapterSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

chapterSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.model("Chapter", chapterSchema);