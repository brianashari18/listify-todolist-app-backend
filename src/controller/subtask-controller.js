
import subtasksService from "../service/subtasks-service.js";
import taskService from "../service/task-service.js";

const create = async (req,res, next) => {
    try {
        const result = await subtasksService.create(req);
        res.status(200).json({
            data: result,
            message : "subTask Created Successfully"
        });
    }catch (e){
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const result = await subtasksService.get(req);
        res.status(200).json({
            data: result,
            message : "subTask Get Successfully",
        })
    }catch (e){
        next(e);
    }
}

const getByName = async (req,res, next) => {
    try {
        const result = await subtasksService.getByName(req);
        res.status(200).json({
            data: result,
            message : "subTask Get Successfully",
        })
    }catch (e){
        next(e);
    }
}

const update = async (req,res, next) => {
    try {
        const result = await subtasksService.update(req);
        res.status(200).json({
            data: result,
            message : "subTask Updated Successfully",
        })
    }catch (e){
        next(e);
    }
}

const deleteSubTask = async (req,res, next) => {
    try {
        await subtasksService.deleteSubTask(req);
        res.status(200).json({
            data: "OK",
            message : "SubTask Deleted Successfully",
        })
    }catch (e){
        next(e);
    }
}

export default {
    create,get,getByName,update, deleteSubTask
}