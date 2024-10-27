import { SessionOptions } from "express-session";

export const sessionConfig = {
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie:
        process.env.NODE_ENV === "production"
            ? {
                  httpOnly: true,
                  secure: true,
                  maxAge: 3 * 24 * 60 * 60 * 1000,
              }
            : { maxAge: 3 * 24 * 60 * 60 * 1000 },
};
