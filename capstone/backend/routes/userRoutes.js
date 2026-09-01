const express = require("express");
const router = express.Router();

const userController =require("../controllers/userController");

router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/all",userController.getAllUsers);
router.get("/type/:type",userController.getUsersByType);

module.exports = router;