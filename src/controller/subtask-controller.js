import subtasksService from "../service/subtasks-service.js";

const create = async (req, res, next) => {
    try {
        const result = await subtasksService.create(req);
        res.status(200).json({
            data: result,
            message: "subTask Created Successfully",
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const result = await subtasksService.get(req);
        res.status(200).json({
            data: result,
            message: "subTask Get Successfully",
        });
    } catch (e) {
        next(e);
    }
};

const getByName = async (req, res, next) => {
    try {
        const result = await subtasksService.getByName(req);
        res.status(200).json({
            data: result,
            message: "subTask Get Successfully",
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await subtasksService.update(req);
        res.status(200).json({
            data: result,
            message: "subTask Updated Successfully",
        });
    } catch (e) {
        next(e);
    }
};

const deleteSubTask = async (req, res, next) => {
    try {
        await subtasksService.deleteSubTask(req);
        res.status(200).json({
            data: "OK",
            message: "SubTask Moved to Trash Successfully",
        });
    } catch (e) {
        next(e);
    }
};

const restoreSubTask = async (req, res, next) => {
    try {
        const result = await subtasksService.restoreSubTask(req);
        res.status(200).json({
            data: result,
            message: "subTask Restored Successfully",
        });
    } catch (e) {
        next(e);
    }
};

const deletePermanently = async (req, res, next) => {
    try {
        await subtasksService.deletePermanently(req);
        res.status(200).json({
            data: "OK",
            message: "subTask Deleted Permanently Successfully",
        });
    } catch (e) {
        next(e);
    }
};

const getTrash = async (req, res, next) => {
    try {
        const result = await subtasksService.getTrashByUser(req);
        res.status(200).json({
            data: result,
            message: "Get Trash Successfully",
        });
    } catch (e) {
        next(e);
    }
};

export default {
    create,
    get,
    getByName,
    update,
    deleteSubTask,
    restoreSubTask,
    deletePermanently,
    getTrash
};
