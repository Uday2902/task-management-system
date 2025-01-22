const { StatusCodes } = require("http-status-codes");
const Models = require("../models/index");

const createTask = async (req, res) => {
    try {
        const { mongoID,  } = req.body;
        console.log(mongoID)
        const createdTask = await Models.Task.create({ ...req.body, user: mongoID });
        const user = await Models.User.updateOne(
            { _id: mongoID },
            { $push: { pendingTasks: createdTask._id } }
        );
        console.log("Updated user -> ", user);
        if (!createdTask) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to create task" });
        }
        res.status(StatusCodes.CREATED).json({ message: "Task created successfully!", data: createdTask });
    } catch (err) {
        console.error("Error creating new task : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error!" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Models.Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found!" });
        }
        res.status(StatusCodes.OK).json({ message: "Task deleted successfuly!", data: deletedTask });
    } catch (err) {
        console.error("Error deleting task : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error!" });
    }
};

const getTasks = async (req, res) => {
    try {
        const { mongoID } = req.body;
        console.log("MongoID -> ", mongoID);
        const user = await Models.User.findOne({ _id: mongoID }).populate([
            { path: "pendingTasks" },
            { path: "inProgressTasks" },
            { path: "completedTasks" }
        ]);
        
        // console.log("User with populated tasks ->", user);
        if (!user) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Not able to find any user!" })
        }
        let allTasks = [];
        allTasks.push(user.pendingTasks ?? [], user.inProgressTasks ?? [], user.completedTasks ?? []);
        allTasks = allTasks.flat()
        
        res.status(StatusCodes.OK).json({ message: "All tasks list", data: allTasks });
    } catch (err) {
        console.error("Error fetching tasks : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error!" });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Models.Task.findOne({ _id: id });
        if (!task) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to find task by ID" });
        }
        res.status(StatusCodes.OK).json({ message: "Task found with given id", data: task });
    } catch (err) {
        console.error("Error fetching task by id : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error!" });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const previousTask = await Models.Task.findById(id);
        
        if (!previousTask) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
        }
      
        const updatedTask = await Models.Task.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
      
        if (updatedData.status) {
          if (previousTask.status !== updatedData.status) {
            const currentStatus = previousTask.status;
            const newStatus = updatedData.status;
      
            const updatedUser = await Models.User.findByIdAndUpdate(
              previousTask.user,
              {
                $pull: { [currentStatus]: id },
                $push: { [newStatus]: id }
              },
              { new: true }
            );
      
            console.log("Updated User -> ", updatedUser);
          }
        }
      
        res.status(StatusCodes.OK).json({ message: "Task updated successfully!", data: updatedTask });
        
      } catch (err) {
        console.error("Error with updating task : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error!" });
    }
};

module.exports = {
    createTask,
    deleteTask,
    getTasks,
    getTaskById,
    updateTask
};
