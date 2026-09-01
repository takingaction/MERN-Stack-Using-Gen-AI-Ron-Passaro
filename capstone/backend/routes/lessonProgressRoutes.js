const express = require("express");
const router = express.Router();

const lessonProgressController = require("../controllers/lessonProgressController");

router.post("/complete", lessonProgressController.markComplete);
router.delete("/complete/:lessonId/:studentEmail", lessonProgressController.unmarkComplete);
router.get("/course/:courseId/:studentEmail", lessonProgressController.getCourseProgress);

module.exports = router;