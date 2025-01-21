const express = require("express");
const router = express.Router();

const {controllers} = require("../controllers/index");

router.route("/").get(controllers.tasks.getTasks);
router.route("/:id").get(controllers.tasks.getTaskById);
router.route("/").post(controllers.tasks.createTask);
router.route("/:id").put(controllers.tasks.updateTask);
router.route("/:id").delete(controllers.tasks.deleteTask);

module.exports = router;
