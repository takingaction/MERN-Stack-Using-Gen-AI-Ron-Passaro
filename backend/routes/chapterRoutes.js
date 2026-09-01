const express = require("express");
const router = express.Router();

const chapterController = require("../controllers/chapterController");

router.post("/create", chapterController.createChapter);
router.get("/course/:courseId", chapterController.getChaptersByCourse);
router.get("/get/:id", chapterController.getChapterById);
router.put("/update/:id", chapterController.updateChapter);
router.put("/reorder", chapterController.reorderChapters);
router.delete("/delete/:id", chapterController.deleteChapter);

module.exports = router;