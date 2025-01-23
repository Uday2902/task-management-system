const express = require("express");
const router = express.Router();

const controller = require("../controllers/index")

router.route('/login').post(controller.user.loginUser);
router.route('/register').post(controller.user.registerUser);

module.exports = router;
