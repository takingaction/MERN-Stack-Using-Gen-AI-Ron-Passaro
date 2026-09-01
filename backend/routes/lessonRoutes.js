const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: 50 * 1024 * 1024 });

const lessonController = require("../controllers/lessonController");

router.post("/create", upload.single("video"), lessonController.createLesson);
router.get("/chapter/:chapterId", lessonController.getLessonsByChapter);
router.get("/content/:courseId", lessonController.getCourseContent);
router.get("/course/:courseId", lessonController.getLessonsByCourse);
router.get("/get/:id", lessonController.getLessonById);
router.get("/video/:id", lessonController.getLessonVideo);
router.put("/update/:id", upload.single("video"), lessonController.updateLesson);
router.put("/reorder", lessonController.reorderLessons);
router.delete("/delete/:id", lessonController.deleteLesson);

module.exports = router;