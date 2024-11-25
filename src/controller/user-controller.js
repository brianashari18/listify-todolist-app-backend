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
        const user = req.user
        const result = await userService.resetPassword(user,req.body);
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
        const id = req.user.id;
        const result = await userService.get(id);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.user.id);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const changeUsername = async (req, res, next) => {
    try{
        const user = req.user
        const result = await userService.changeUsername(user);
        res.status(200).json({
            data: result,
            message : "OK"
        })
    }catch (e){
        next(e);
    }
}

const changePassword = async (req, res, next) => {
    try {
        const user = req.user
        const request = req.body
        const result =  userService.changePassword(user, request);
        res.status(200).json({
            data: result,
            message : "OK"
        })
    }catch (e){
        next(e);
    }
}

export default { register,login, forgotPassword,resetPassword,get, logout, changePassword, changeUsername };