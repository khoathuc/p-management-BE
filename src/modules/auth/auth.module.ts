import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "@db/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { EmailService } from "src/providers/email/mail.service";
import { UsersService } from "@modules/users/users.service";
import { UsersModel } from "@modules/users/users.model";
import { PrismaLogging } from "@providers/logger/logging.prisma";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        JwtService,
        EmailService,
        UsersService,
        UsersModel,
        PrismaLogging
    ],
})
export class AuthModule {}
