import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {
    emailValidation,
    getUserValidation,
    registerUserValidation, updateUserValidation,
} from "../validation/user-validation.js";
import {loginUserValidation} from "../validation/user-validation.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import nodemailer from "nodemailer";
import 'dotenv/config'
import Joi from "joi";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where : {
            username  : user.username,
        }
    })

    const countEmail = await prismaClient.user.count({
        where : {
            email : user.email,
        }
    })

    if (countUser === 1) {
        throw new ResponseError(400,"User already exists");
    } else if (countEmail === 1) {
        throw new ResponseError(400,"Email already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data : user,
        select: {
            username: true,
            email: true
        }
    })

}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true,
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or Password is incorrect");
    }

    console.log(loginRequest.password);
    console.log(user.password);
    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or Password wrong");
    }
    const token = uuid().toString();

    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });
};

const forgotPassword = async (request) => {
    const {email} = validate(emailValidation, request);

    const user = await prismaClient.user.findUnique({
        where :{
            email : email
        },
        select:{
            username: true,
            email: true,
        }
    })

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    // const otpExpire = new Date();
    // otpExpire.setMinutes(otpExpire.getMinutes() + 1);

    await prismaClient.user.update({
        where: {
            email: email,
        },
        data: {
            otp: otp,
            // otpExpire: otpExpire,
        }
    });

    //send OTP to email

}

const resetPassword = async (request) => {
    const newPassword = request.newPassword
    const confirmPassword = request.confirmPassword
    const email = request.email;

    if (!newPassword || !confirmPassword ) {
        throw new ResponseError(400, "Invalid input");
    }

    if (newPassword !== confirmPassword) {
        throw new ResponseError(400, "Passwords do not match");
    }


    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prismaClient.user.update({
            where: {
                email: email,
            },
            data: { password: hashedPassword }
        });
    } catch (error) {
        throw new ResponseError(500, "Failed to reset password");
    }
}

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
}

const changePassword = async (user,request) => {
    const password = validate(updateUserValidation,request);

    if(password.password !== password.confirmPassword) {
        throw new ResponseError(404, "Password do not match");
    }

    const hashedPassword = await bcrypt.hash(password.password, 10);
    await prismaClient.user.update({
        where: {
            username: user.username,
        },data  : {
            password: hashedPassword
        }
    })

}


const logout = async (username) => {
    username = validate(getUserValidation,username)


    const user = await prismaClient.user.findUnique({
        where : {
            username : username
        }
    })

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    await prismaClient.user.update({
        where: {
            username: username
        },data:{
            token : null
        }, select : {
            username: true
        }
    })
}

export default { register ,login, forgotPassword, resetPassword, get, logout,changePassword};