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
    Session,
    Put,
    Body,
} from "@nestjs/common";
import { ApiFile } from "@decorators/api.file.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { User } from "@prisma/base";
import { ParseFile } from "@common/pipes/parse.file.pipe";
import AuthUser from "@decorators/auth.decorator";
import { UserPersonalInfoDto } from "./dto/update.user.settings.dto";

@Controller("users")
@ApiTags("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get("/me")
    @ApiOperation({
        summary: "Get current user",
        description: "Get current user",
    })
    getMe(@AuthUser() user) {
        return this.usersService.releasePayload(user);
    }

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

    @Get(":id")
    @ApiOperation({
        summary: "Get user by id",
        description: "Get user by id",
    })
    async getById(@Param("id") id: string) {
        try {
            const user = await this.usersService.getById(id);
            return { user: this.usersService.releasePayload(user) }
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    @Put("/info")
    @ApiOperation({
        summary: "Update user personal info",
        description: "Update user personal info by id"
    })
    async updateUserPersonalInfo(@Session() session, @AuthUser() authUser: User, @Body() userPersonalInfoDto: UserPersonalInfoDto) {
        try {
            const user = await this.usersService.updateUserPersonalInfo(authUser, userPersonalInfoDto);

            //update sesssion when current user update
            session.user = user;

            return { user: this.usersService.releasePayload(user) }
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post("/avatar")
    @ApiFile("avatar", true)
    async uploadAvatar(
        @AuthUser() user: User,
        @UploadedFile(ParseFile) file: Express.Multer.File
    ) {
        try {
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
