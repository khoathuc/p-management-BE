import { DTC } from "@shared/dtc";
import { Response } from "express";

export function setAuthTokenCookie(response: Response, token: string): void {
    const isProd = process.env.NODE_ENV === "production";
    // Set domain only in production
    const cookieOptions: any = {
        secure: isProd, // Use secure flag in production
        httpOnly: true, // HttpOnly to prevent client-side access
        sameSite: isProd ? "lax" : "none", // SameSite None for production
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration date (7 days)
    };

    // Omit domain in local development
    if (isProd) {
        cookieOptions.domain =
            "." + new URL(process.env.FRONTEND_URL!).hostname;
    }

    response.cookie("auth_token", token);
}
