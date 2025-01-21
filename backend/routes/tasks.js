const express = require("express");
const router = express.Router();

const controllers = require("../controllers/index");
const { authMiddleware } = require("../middlewares/index")

router.route("/").get(authMiddleware, controllers.task.getTasks);
router.route("/:id").get(authMiddleware, controllers.task.getTaskById);
router.route("/").post(authMiddleware, controllers.task.createTask);
router.route("/:id").put(authMiddleware, controllers.task.updateTask);
router.route("/:id").delete(authMiddleware, controllers.task.deleteTask);

module.exports = router;
