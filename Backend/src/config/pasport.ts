import passport from 'passport';
import {Strategy as Googlestrategy} from "passport-google-oauth20";
import dotenv from 'dotenv';
dotenv.config();
import User, { IdUser } from '../models/User.model';

passport.use(
    new Googlestrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = await new User({
                    googleId: profile.id,
                    email: profile.emails![0].value,
                    displayname: profile.displayName,
                    profileImage: profile.photos![0].value
                }).save();
            }

            if (user) {
                done(null, user);
            } else {
                done(new Error('User not found'), undefined);
            }
        } catch (err) {
            done(err as Error, undefined)
        }
    })
);


passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// serializeUser:::After authentication, Passport saves the user’s unique ID (_id) into the session. This minimizes the size of session data.

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err as Error, undefined);
    }
});

// deserializeUser:::When a request is made, Passport retrieves the user from the database using the stored ID and attaches the user object to the request.