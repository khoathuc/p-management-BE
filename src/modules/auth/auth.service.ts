import { EmailService } from "src/providers/email/mail.service";
import { RegisterDto } from "@modules/auth/dto/register.dto";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "@db/prisma.service";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "@modules/users/users.service";
import { nanoid } from "nanoid";
import { LoginDto } from "./dto/login.dto";
import { AuthPayload } from "@interfaces/auth.payload";
import { GoogleUserDto } from "./dto/google.user.dto";
import { UserStatus } from "@prisma/client";
@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private readonly usersService: UsersService,
        private emailService: EmailService
    ) {}

    /**
     * @desc register new user
     * @param registerDto
     * @returns
     */
    async register(registerDto: RegisterDto) {
        // Check if username and email are already registered
        const existingUser = await this.usersService.getByEmailOrUsername({
            email: registerDto.email,
            username: registerDto.username,
        });

        if (existingUser) {
            if (existingUser.email === registerDto.email) {
                throw new Error("This email has been used.");
            }
            if (existingUser.username === registerDto.username) {
                throw new Error("This username has been used.");
            }
        }

        // Create new user
        return await this.usersService.create(registerDto);

        // TODO: create new email verify token

        // TODO: send email verify account.

        // TODO: track user register metric.
    }

    /**
     * @desc login user
     * @param data
     * @returns
     */
    async login(data: LoginDto): Promise<any> {
        // Check if user exists
        const user = await this.usersService.getByEmail(data.email);
        if (!user) {
            throw new Error("Account is not exist.");
        }

        // Check if password is correct
        const verify = await compare(data.password, user.password);
        if (!verify) {
            throw new Error("Password is incorrect");
        }

        const payload: AuthPayload = this.usersService.releasePayload(user);

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: "1h",
        });

        return {
            accessToken,
            payload,
        };
    }

    async validateUser(googleUser: GoogleUserDto) {
        const user = await this.usersService.getByEmail(googleUser.email);
        if (user) {
            const account = await this.prismaService.account.findUnique({
                where: {
                    userId: user.id,
                },
            });
            if (account) {
                return account;
            }
            await this.prismaService.account.create({
                data: {
                    userId: user.id,
                    email: googleUser.email,
                    type: "Oauth",
                    provider: "Google",
                    providerAccountId: googleUser.providerId,
                    refresh_token: googleUser.refreshToken,
                    access_token: googleUser.accessToken,
                },
            });
            return account;
        }
        // Create new User
        const newUser = await this.prismaService.user.create({
            data: {
                username: googleUser.displayName,
                email: googleUser.email,
                status: UserStatus.Active,
            },
        });
        const account = await this.prismaService.account.create({
            data: {
                userId: newUser.id,
                email: googleUser.email,
                type: "Oauth",
                provider: "Google",
                providerAccountId: googleUser.providerId,
                refresh_token: googleUser.refreshToken,
                access_token: googleUser.accessToken,
            },
        });
        return account;
    }

    /**
     * @desc forgot password
     * @param email
     * @returns
     */
    async forgotPassword(email: string) {
        // Check if email is valid
        const user = await this.usersService.getByEmail(email);
        if (!user) {
            throw new BadRequestException("Email is invalid");
        }

        var expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const resetToken = nanoid();

        // Delete existed token
        await this.prismaService.forgotPasswordToken.delete({
            where: {
                userId: user.id,
            },
        });

        // Create new token
        await this.prismaService.forgotPasswordToken.create({
            data: {
                token: resetToken,
                expires: expiryDate,
                userId: user.id,
            },
        });

        // Send password reset email.
        await this.sendPasswordResetEmail(email, resetToken);
    }

    /**
     * @desc user reset password
     * @param newPassword
     * @param resetToken
     */
    async resetPassword(newPassword: string, resetToken: string) {
        const token = await this.prismaService.forgotPasswordToken.findUnique({
            where: {
                token: resetToken,
                expires: { gt: new Date() },
            },
        });

        if (!token) {
            throw new UnauthorizedException("Invalid link");
        }

        await this.prismaService.forgotPasswordToken.delete({
            where: {
                token: resetToken,
                expires: { gt: new Date() },
            },
        });

        // Check if token is valid
        const user = await this.usersService.getById(token.userId);
        if (!user) {
            throw new InternalServerErrorException();
        }

        // Update password
        return await this.usersService.updatePassword(user, newPassword);
    }

    /**
     * @desc send password reset email
     */
    async sendPasswordResetEmail(email: string, token: string) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.emailService.sendEmail({
            from: "Auth-backend service",
            to: email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
        });
    }
}
