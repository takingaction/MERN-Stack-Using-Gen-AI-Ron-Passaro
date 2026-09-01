const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");

router.get("/room/:courseId", chatController.getOrCreateRoom);
router.get("/messages/:courseId", chatController.getMessages);
router.post("/messages/:courseId", chatController.postMessage);

module.exports = router;
