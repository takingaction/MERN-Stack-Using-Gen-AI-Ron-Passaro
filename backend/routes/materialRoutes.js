const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: 50 * 1024 * 1024 });
const materialController = require("../controllers/materialController");

router.post("/upload", upload.single("file"), materialController.uploadMaterial);
router.get("/course/:courseId", materialController.getMaterialsByCourse);
router.get("/:id", materialController.downloadMaterial);
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;
