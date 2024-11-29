import authService from '../service/google-service.js';
import { logger } from '../application/logging.js';
import { ResponseError } from '../error/response-error.js';
import googleService from "../service/google-service.js";

// const initiateGoogleLogin = async (req, res, next) => {
//     try {
//         const authUrl = authService.generateAuthUrl();
//         res.redirect(authUrl);
//     } catch (e) {
//         next(e);
//     }
// };
//
//
// const handleGoogleCallback = async (req, res, next) => {
//     const { code } = req.query;
//
//     try {
//         const tokens = await authService.getTokens(code);
//         const profile = await authService.getUserProfile(tokens.access_token);
//         const user = await authService.findOrCreateUser(tokens.access_token,profile);
//         logger.info(`User authenticated: ${user.email}`);
//         res.status(200).json({
//             data: {
//                 user
//             },
//             message: 'Authentication successful',
//         });
//     } catch (e) {
//         next(new ResponseError(400, 'Google login error'));
//     }
// };

const googleLogin = async (req, res, next) => {
    try {
        const reqBody = req.body;
        logger.info(reqBody);
        const accessToken = reqBody["access_token"];
        const idToken = reqBody["id_token"];
        const clientId = reqBody["client_id"];
        const payload = await googleService.verify(idToken, clientId);

        const email = payload["email"];
        const name = payload["name"];
        const user = await authService.findOrCreateUser(accessToken, email, name);

        res.status(200).json({
            data: user,
            message: 'Authentication successful',
        });
    } catch (e) {
        next(new ResponseError(400, 'Google login error'));
    }
};


export default {
    // initiateGoogleLogin,
    // handleGoogleCallback,
    googleLogin
};
