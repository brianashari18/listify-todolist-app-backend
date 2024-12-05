import workspaceService from "../service/workspace-service.js";

const create = async (req,res, next) => {
    try {
        const user = req.user
        const request = req.body
        const result = await workspaceService.create(user,request);
        res.status(200).json({
            data: result,
            message : "Task Created Successfully"
        });
    }catch (e){
        next(e);
    }
}

const addUser = async (req,res, next) => {
    try {
        const result = await workspaceService.addUser(req);
        res.status(200).json({
            data: result,
        });
    }catch (e){
        next(e);
    }
}

const update = async (req,res, next) => {
    try {
        const user = req.user
        const result = await workspaceService.update(user,req);
        res.status(200).json({
            data: result,
        });
    }catch (e){
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const request = req.user
        const result = await workspaceService.get(request);
        res.status(200).json({
            data: result,
        });
    }catch (e){
        next(e);
    }
}

const deleteTaskWorkspace = async (req,res, next) => {
    try {
        const user = req.user;
        await workspaceService.deleteTaskWorkspace(user, req);
        res.status(200).json({
            data : "task Deleted Successfully",
        })
    }catch (e){
        next(e);
    }
}

const removeUser = async (req,res, next) => {
    try {
        await workspaceService.removeUser(req);
        res.status(200).json({
            data : "user Removed Successfully",
        })
    }catch (e){
        next(e);
    }
}

export default {
    create,addUser,update, get, deleteTaskWorkspace, removeUser
}