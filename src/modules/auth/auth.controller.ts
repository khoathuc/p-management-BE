import {
    Body,
    Controller,
    Post,
    UseGuards,
    HttpException,
    HttpStatus,
    Get,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { LocalGuard } from "@guards/local.guard";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "src/providers/google/guards";
import { ForgotPasswordDto } from "./dto/forgotpassword.dto";
import { ResetPasswordDto } from "./dto/resetpassword.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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

    @Post("/login")
    @ApiOperation({
        summary: "Login user",
        description: "Login user",
    })
    @UseGuards(LocalGuard)
    async login(@Body() loginDto: LoginDto) {
        try {
            return this.authService.login(loginDto);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    googleLogin() {
        return { msg: 'Google Login' } 
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    googleRedirect() {
        return { msg: 'Google Redirect' }
    }

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
}
