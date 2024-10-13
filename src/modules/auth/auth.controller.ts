import {
    Body,
    Controller,
    Post,
    HttpException,
    HttpStatus,
    Res,
    Get,
    Param,
} from "@nestjs/common";
import { Response } from "express";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgotpassword.dto";
import { ResetPasswordDto } from "./dto/resetpassword.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { setAuthTokenCookie } from "@common/cookie/cookie";
import { Public } from "@decorators/public.route.decorator";
import { WorkspacesService } from "@modules/workspaces/workspaces.service";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly _workspaceService: WorkspacesService
    ) {}

    @Public()
    @Post("/register")
    @ApiOperation({
        summary: "Register new user",
        description: "Register new user",
    })
    async register(@Body() registerDto: RegisterDto) {
        try {
            return await this.authService.register(registerDto);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Public()
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
            const { accessToken, payload } = await this.authService.login(
                loginDto
            );

            setAuthTokenCookie(response, accessToken);

            return { user: payload };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Public()
    @Post("/forgot-password")
    @ApiOperation({
        summary: "User forgot password",
        description: "User forgot password",
    })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        try {
            return this.authService.forgotPassword(forgotPasswordDto.email);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Public()
    @Post("/reset-password")
    @ApiOperation({
        summary: "User reset password",
        description: "User reset password",
    })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        try {
            const { resetToken, newPassword } = resetPasswordDto;

            return this.authService.resetPassword(newPassword, resetToken);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Public()
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
            const user = await this.authService.verifyAccount(id, token);

            const workspace = await this._workspaceService.create;

            const { accessToken, payload } =
                await this.authService.releaseToken(user);

            setAuthTokenCookie(response, accessToken);

            return { user: payload };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
