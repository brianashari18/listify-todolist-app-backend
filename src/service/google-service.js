import {google} from 'googleapis';
import {prismaClient} from '../application/database.js';
import {OAuth2Client} from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URL;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const client = new OAuth2Client();

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

const findOrCreateUser = async (token,email,name) => {
    let user = await prismaClient.user.findUnique({
        where: { email },
    });

    if (!user) {
        user = await prismaClient.user.create({
            data: {
                email : email,
                username : name,
                token : token
            }
        });
    } else {
        user = await prismaClient.user.update({
            where: {
                email : email,
            },
            data: {
                token: token,
            }
        })
    }

    return user;
};

const verify = async (token, client_id) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id,
    });
    return ticket.getPayload();
}

export default {
    generateAuthUrl,
    getTokens,
    getUserProfile,
    findOrCreateUser,
    verify
};
