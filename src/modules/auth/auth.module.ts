import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaBaseService } from "@db/prisma.base.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { EmailService } from "src/providers/email/mail.service";
import { UsersService } from "@modules/users/users.service";
import { UsersModel } from "@modules/users/users.model";
import { WorkspacesService } from "@modules/workspaces/workspaces.service";
import { WorkspacesModel } from "@modules/workspaces/workspaces.model";
import { WorkspacesFollowingService } from "@modules/workspaces/following/following.service";

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
        PrismaBaseService,
        JwtService,
        EmailService,
        UsersService,
        UsersModel,
        WorkspacesService,
        WorkspacesModel,
        WorkspacesFollowingService
    ],
})
export class AuthModule {}
