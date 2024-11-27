import {createFeedbackValidation} from "../validation/feedback-validation.js";
import {validate} from '../validation/validation.js';
import {ResponseError} from "../error/response-error.js";
import nodemailer from "nodemailer";
import 'dotenv/config'


const sendFeedback = async (request) => {
    const feedback = await validate(createFeedbackValidation,request.body);
    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: feedback.email + '<process.end.EMAIL>',
        to: process.env.EMAIL,
        subject: feedback.subject,
        text: feedback.feedback,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new ResponseError(500, "Failed to send OTP email");
    }


}

export default {
    sendFeedback
}