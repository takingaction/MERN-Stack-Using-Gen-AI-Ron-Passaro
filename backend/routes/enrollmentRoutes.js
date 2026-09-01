const express = require("express");
const router = express.Router();

const enrollmentController = require("../controllers/enrollmentController");

router.post("/request", enrollmentController.requestEnrollment);
router.get("/student/:email", enrollmentController.getStudentEnrollments);
router.get("/pending/instructor/:email", enrollmentController.getPendingForInstructor);
router.put("/:id/approve", enrollmentController.approveEnrollment);
router.put("/:id/reject", enrollmentController.rejectEnrollment);
router.get("/approved/student/:email", enrollmentController.getApprovedCoursesForStudent);

module.exports = router;
