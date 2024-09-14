import { PrismaService } from "@db/prisma.service";
import { AuthService } from "@modules/auth/auth.service";
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private authService: AuthService, private prismaService: PrismaService) {
        super();
    }

    async serializeUser(account: User, done: Function) {
        console.log('Serializer user');
        done(null, account);
    }

    async deserializeUser(payload: any, done: Function) {
        const account = await this.prismaService.account.findUnique({
            where: {
               userId : payload.userId,
            }
        });
        console.log('Deserialize user');
        return account ? done(null, account) : done(null, null);
    }
}