import { EmailService } from "src/providers/email/mail.service";
import { RegisterDto } from "@modules/auth/dto/register.dto";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { PrismaBaseService } from "@db/prisma.base.service";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "@modules/users/users.service";
import { nanoid } from "nanoid";
import { LoginDto } from "./dto/login.dto";
import { AuthPayload } from "@interfaces/auth.payload";
import { GoogleUserDto } from "./dto/google.user.dto";
import { User, UserStatus } from "@prisma/client";
import { DTC } from "@shared/dtc";
import { Token } from "@shared/token";
@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaBaseService,
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
        const user = await this.usersService.create(registerDto);

        await this.sendRegisterEmailVerify(user);

        // TODO: track user register metric.

        return user;
    }

    /**
     * @desc send register email
     */
    async sendRegisterEmailVerify(user) {
        const { email } = user;
        const emailToken = await this.generateEmailToken(user);
        const resetLink = `${process.env.FRONT_END_URL}/auth/${user.id}/email-verify/${emailToken}`;

        await this.emailService.sendEmail({
            from: "Auth-backend service",
            to: email,
            subject: "Register Request",
            html: `<p>You requested a register. Click the link below to verify your account:</p><p><a href="${resetLink}">Register Verify</a></p>`,
        });
    }

    /**
     * @desc generate email token
     */
    async generateEmailToken(user: User) {
        const emailToken = await this.prismaService.emailToken.create({
            data: {
                userId: user.id,
                token: Token.generate(),
                expires: DTC.nextDays(1),
            },
        });

        return emailToken;
    }

    /**
     * @desc verify email
     * @param {string} id
     * @param {string} token
     * @returns
     */

    async verifyAccount(id: string, token: string) {
        const user = await this.usersService.getById(id);
        if (!user) throw new BadRequestException("Invalid link");

        const emailToken = await this.prismaService.emailToken.findUnique({
            where: {
                token: token,
            },
        });
        if (!emailToken) throw new BadRequestException("Invalid link");

        await this.usersService.updateEmailVerified(user);
        await this.prismaService.emailToken.delete({
            where: {
                userId: id,
            },
        });

        return user;
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

        // Check if email is verified else resend link verify
        const emailVerified = user.emailVerified;
        if (!emailVerified) {
            throw new Error("Your email is not verified");
        }

        const payload: AuthPayload = this.usersService.releasePayload(user);

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: "1h",
        });

        return await this.releaseToken(user);
    }

    async releaseToken(user: User) {
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
