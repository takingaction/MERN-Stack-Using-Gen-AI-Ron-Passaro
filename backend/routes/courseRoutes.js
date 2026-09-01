const express = require("express");
const router = express.Router();

const courseController =require("../controllers/courseController");

router.post("/create",courseController.createCourse);
router.get("/all",courseController.getAllCourses);
router.get("/title/:title",courseController.getCourseByTitle);
router.get("/instructor/:email",courseController.getCoursesByInstructor);
router.get("/get/:id",courseController.getCourseById);
router.put("/update/:id",courseController.updateCourse);
router.delete("/delete/:id",courseController.deleteCourse);

module.exports = router;