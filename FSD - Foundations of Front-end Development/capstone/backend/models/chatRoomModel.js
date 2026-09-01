const mongoose = require("mongoose");
mongoose.pluralize(null);

const chatRoomSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        unique: true
    },
    participants: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
