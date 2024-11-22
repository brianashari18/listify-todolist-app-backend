import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {
    emailValidation,
    registerUserValidation, updateUserValidation,
} from "../validation/user-validation.js";
import {loginUserValidation} from "../validation/user-validation.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import 'dotenv/config'
import {logger} from "../application/logging.js";
import nodemailer from "nodemailer";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countEmail = await prismaClient.user.count({
        where : {
            email : user.email,
        }
    })

    if (countEmail === 1) {
        throw new ResponseError(400,"Email already exists");
    }

    if(user.password !== user.confirmPassword) {
        throw new ResponseError(400,"Passwords do not match");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data : {
            username: user.username,
            email : user.email,
            password: user.password,
        },
        select: {
            username: true,
            email: true
        }
    })

}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    logger.info(loginRequest);
    const user = await prismaClient.user.findUnique({
        where: {
            email : loginRequest.email,
        },
        select: {
            password: true
        }
    });

    logger.info(user)
    if (!user) {
        throw new ResponseError(401, "Email or Password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Email or Password wrong");
    }
    const token = uuid().toString();

    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            email: loginRequest.email
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
            id : true,
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

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: '"Your App Name" <process.end.EMAIL>',
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for resetting the password is ${otp}. It is valid for 1 minutes.`,
        html: `<p>Your OTP for resetting the password is <b>${otp}</b>. It is valid for 1 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new ResponseError(500, "Failed to send OTP email");
    }

}

const resetPassword = async (user,request) => {
    const newPassword = request.newPassword
    const confirmPassword = request.confirmPassword

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
                email: user.email,
            },
            data: { password: hashedPassword }
        });
    } catch (error) {
        throw new ResponseError(500, "Failed to reset password");
    }
}

const get = async (id) => {
    const user = await prismaClient.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            username:true,
            email:true,
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
}

const changeUsername = async (user,request) => {
    await prismaClient.user.update({
        where:{
            id: user.id,
        },data : {
            username: user.username,
        }
    })
}

const changePassword = async (user,request) => {
    const password = validate(updateUserValidation,request);

    if(password.password !== password.confirmPassword) {
        throw new ResponseError(404, "Password do not match");
    }

    const hashedPassword = await bcrypt.hash(password.password, 10);
    await prismaClient.user.update({
        where: {
            email: user.email,
        },data  : {
            password: hashedPassword
        }
    })

}


const logout = async (id) => {

    const user = await prismaClient.user.findUnique({
        where : {
            id : id
        }
    })

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    await prismaClient.user.update({
        where: {
            id: id
        },data:{
            token : null
        }, select : {
            id: true
        }
    })
}

export default { register ,login, forgotPassword, resetPassword, get, logout,changePassword,changeUsername }