const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedbackController");

router.post("/", feedbackController.submitFeedback);
router.get("/course/:courseId", feedbackController.getCourseFeedback);
router.get("/average/:courseId", feedbackController.getAverageRating);
router.get("/check/:courseId/:email", feedbackController.checkHasFeedback);

module.exports = router;
