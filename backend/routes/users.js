const express = require("express");
const router = express.Router();

const controller = require("../controllers/index")
const { authMiddleware } = require("../middlewares/index");

router.route('/login').post(authMiddleware, controller.user.loginUser);
router.route('/register').post(controller.user.registerUser);

module.exports = router;
