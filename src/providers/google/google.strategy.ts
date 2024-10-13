import { PrismaBaseService } from "@db/prisma.base.service";
import { AuthService } from "@modules/auth/auth.service";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private prismaService: PrismaBaseService) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.GG_CALL_BACK_URL,
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {

        const {id, name, emails} = profile;

        const user = await this.authService.validateUser({
            email: profile.emails[0].value,
            displayName: profile.displayName,
            accessToken: accessToken,
            refreshToken: refreshToken,
            providerId: profile.id,
        })
        
        return user || null;
    }
}