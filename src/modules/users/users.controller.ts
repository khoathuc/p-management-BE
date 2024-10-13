import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    UseGuards,
    Post,
    UploadedFile,
} from "@nestjs/common";
import { ApiFile } from "@decorators/api.file.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { User } from "@prisma/base";
import AuthUser from "@decorators/auth.decorator";
import { ParseFile } from "@common/pipes/parse.file.pipe";
import { AuthGuard } from "@guards/auth.guard";

@Controller("users")
@ApiTags("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({
        summary: "Get all users",
        description: "Get all users",
    })
    async getAll() {
        try {
            return await this.usersService.getAll();
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(AuthGuard)
    @Get("/me")
    getMe(@AuthUser() user: User) {
        return user;
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get user by id",
        description: "Get user by id",
    })
    async getById(@Param("id") id: string) {
        try {
            return await this.usersService.getById(id);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post(":id/avatar")
    @ApiFile("avatar", true)
    /**
     * TODO : add user permissions.
     */
    async uploadAvatar(
        @Param("id") id: string,
        @UploadedFile(ParseFile) file: Express.Multer.File
    ) {
        try {
            const user = await this.usersService.getById(id);
            if (!user) {
                throw new Error("Invalid user");
            }

            return await this.usersService.uploadAvatar(user, file.path);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete(":id")
    /**
     * TODO: add admin permission
     */
    async deleteById(@Param("id") id: string): Promise<User> {
        try {
            const user = await this.usersService.getById(id);

            if (!user) {
                throw new BadRequestException("User not found");
            }

            return await this.usersService.deleteById(id);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
