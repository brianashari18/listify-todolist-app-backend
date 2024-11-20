import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data : result
        });
    }catch (e){
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const result = await userService.forgotPassword(req.body);
        res.status(200).json({
            data: result,
            message : "OTP has been sent"
        });
    }catch (e){
        next(e);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const result = await userService.resetPassword(req.body);
        res.status(200).json({
            data: result,
            message : "Reset Successfully"
        });
    }catch (e){
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.get(username);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default { register,login, forgotPassword,resetPassword,get };