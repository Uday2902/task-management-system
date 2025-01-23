const { StatusCodes } = require("http-status-codes");
const Models = require("../models/index");

const createTask = async (req, res) => {
    try {
        const { mongoID } = req.body;
        const createdTask = await Models.Task.create({ ...req.body, user: mongoID });
        const user = await Models.User.updateOne(
            { _id: mongoID },
            { $push: { pendingTasks: createdTask._id } }
        );
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
        res.status(200).json({ message: "Task deleted successfuly!" });
    } catch (err) {
        console.error("Error deleting task : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error!" });
    }
};

const getTasks = async (req, res) => {
    try {
        const { mongoID } = req.body;
        const user = await Models.User.findOne({ _id: mongoID }).populate([
            { path: "pendingTasks" },
            { path: "inProgressTasks" },
            { path: "completedTasks" }
        ]);
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
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Failed to find task by ID" });
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
