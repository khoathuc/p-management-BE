import {
    Body,
    Controller,
    Post,
    HttpException,
    HttpStatus,
    Res,
    Get,
    Param,
    Session,
} from "@nestjs/common";
import { Response } from "express";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgotpassword.dto";
import { ResetPasswordDto } from "./dto/resetpassword.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { WorkspacesService } from "@modules/workspaces/workspaces.service";
import { UsersService } from "@modules/users/users.service";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(
        private readonly _authService: AuthService,
        private readonly _workspaceService: WorkspacesService,
        private readonly _userService: UsersService
    ) {}

    @Post("/register")
    @ApiOperation({
        summary: "Register new user",
        description: "Register new user",
    })
    async register(@Body() registerDto: RegisterDto) {
        try {
            let user = await this._authService.register(registerDto);

            // TODO: remove this logic in register - we do this logic in verify account
            // Create default workspace if user verify success.
            let workspace =
                await this._workspaceService.createUserDefaultWorkspace(user);

            user = await this._userService.updateCurrentWorkspace(
                user,
                workspace
            );

            return { user };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post("/login")
    @ApiOperation({
        summary: "Login user",
        description: "Login user",
    })
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        try {
            const { accessToken } = await this._authService.login(loginDto);

            return { accessToken };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post("/logout")
    @ApiOperation({
        summary: "Logout user",
        description: "Logs out the user by clearing the session.",
    })
    async logout(
        @Session() session,
        @Res({ passthrough: true }) response: Response
    ) {
        try {
            // Destroy the session
            session.destroy((err) => {
                if (err) {
                    throw new HttpException(
                        "Failed to logout",
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            });

            return { message: "User logged out successfully" };
        } catch (error) {
            throw new HttpException(
                "Failed to logout",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post("/forgot-password")
    @ApiOperation({
        summary: "User forgot password",
        description: "User forgot password",
    })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        try {
            return this._authService.forgotPassword(forgotPasswordDto.email);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post("/reset-password")
    @ApiOperation({
        summary: "User reset password",
        description: "User reset password",
    })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        try {
            const { resetToken, newPassword } = resetPasswordDto;

            return this._authService.resetPassword(newPassword, resetToken);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(":id/email-verify/:token")
    @ApiOperation({
        summary: "User verify account",
        description: "User verify account",
    })
    async verifyAccount(
        @Param("id") id: string,
        @Param("token") token: string,
        @Res({ passthrough: true }) response: Response
    ) {
        try {
            let user = await this._authService.verifyAccount(id, token);

            // Create default workspace if user verify success.
            const workspace =
                await this._workspaceService.createUserDefaultWorkspace(user);

            // Update user current workspace.
            user = await this._userService.updateCurrentWorkspace(
                user,
                workspace
            );

            // Release authtoken and save to cookie
            const { accessToken } = await this._authService.releaseToken(user);

            return { accessToken };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
