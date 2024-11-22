import { google } from 'googleapis';
import { prismaClient } from '../application/database.js';
import {logger} from "../application/logging.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URL;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const generateAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });
};

const getTokens = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
};

const getUserProfile = async () => {
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();
    return profile;
};

const findOrCreateUser = async (token,profile) => {
    logger.info(profile);
    const {  email, name } = profile;

    let user = await prismaClient.user.findUnique({
        where: { email },
    });

    if (!user) {
        user = await prismaClient.user.create({
            data: {
                email,
                username : name,
                token : token
            },
        });
    }

    return user;
};


export default {
    generateAuthUrl,
    getTokens,
    getUserProfile,
    findOrCreateUser,
};
