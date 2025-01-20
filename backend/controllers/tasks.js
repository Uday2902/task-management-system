const { StatusCodes } = require("http-status-codes");
const Model = require("../models/index");

const createTask = async (req, res) => {
    try{
        const createdTask = await Model.Task.create({...req.body});
        if(!createdTask){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Failed to create task"});
        }
        res.status(StatusCodes.CREATED).json({message: "Task created successfully!", data: createdTask});
    }catch(err){
        console.error("Error creating new task : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal Server Error!"});
    }
};

const deleteTask = async (req, res) => {
    try{
        const { id } = req.params;
        const deletedTask = await Model.Task.findByIdAndDelete(id);
        if(!deletedTask){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Task not found!"});
        }
        res.status(StatusCodes.OK).json({message: "Task deleted successfuly!", data: deletedTask});
    }catch(err){
        console.error("Error deleting task : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal Server Error!"});
    }
};

const getTasks = async (req, res) => {
    try{
        const allTasks = await Model.Task.find();
        if(!allTasks){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Not able to find any task!"})
        }
        res.status(StatusCodes.OK).json({message: "All tasks list", data: allTasks});
    }catch(err){
        console.error("Error fetching tasks : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal Server Error!"});
    }
};

const getTaskById = async (req, res) => {
    try{
        const { id } = req.params;
        const task = await Model.Task.findOne({id});
        if(!task){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Failed to find task by ID"});
        }
        res.status(StatusCodes.OK).json({message: "Task found with given id", data: task});
    }catch(err){
        console.error("Error fetching task by id : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal Server Error!"});
    }
};

const updateTask = async (req, res) => {
    try{
        const { id } = req.params;
        const updatedData = req.body;
        const updatedTask = await Model.Task.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
        if(!updatedTask){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Updation failed"});
        }
        res.status(StatusCodes.OK).json({ message: "Updated successfully!", data: updatedTask });
    }catch(err){
        console.error("Error with updating task : ", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal Server Error!"});
    }
};

module.exports = {
    createTask,
    deleteTask,
    getTask,
    getTaskById,
    updateTask
};
