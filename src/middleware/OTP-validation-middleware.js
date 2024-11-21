import {prismaClient} from "../application/database.js";

const validateOTP = async (req, res, next) => {
    const { otp } = req.body;

    const user = await prismaClient.user.findUnique({
        where: { otp : otp },
    });

    if (!user) {
        return res.status(400).send({ message: 'Invalid OTP.' });
    }
    // if (Date.now() > user.otpExpiration) {
    //     return res.status(400).send({ message: 'OTP has expired.' });
    // }
    req.user = user;
    next();
};

export {
    validateOTP
}