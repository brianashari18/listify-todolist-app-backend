import taskService from '../service/task-service.js'

const create = async (req,res, next) => {
    try {
        const user = req.user
        const request = req.body
        const result = await taskService.create(user,request);
        res.status(200).json({
            data: result,
            message : "Task Created Successfully"
        });
    }catch (e){
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const request = req.user
        const result = await taskService.get(request);
        res.status(200).json({
            data: result,
        });
    }catch (e){
        next(e);
    }
}

export default {
    create,get,
}