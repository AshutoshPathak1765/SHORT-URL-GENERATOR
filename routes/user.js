const express = require("express");
const { handleNewUserSignUp, handleUserLogin } = require("../controllers/user");
const router = express.Router();

router.post("/", handleNewUserSignUp);
router.post("/login", handleUserLogin);

module.exports = router;
