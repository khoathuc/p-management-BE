import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Delete,
    Patch,
    UnauthorizedException,
    HttpException,
    HttpStatus,
    BadRequestException,
} from "@nestjs/common";
import { HttpMessage } from "@common/constants/http.message";
import { WorkspacesService } from "./workspaces.service";
import { WorkspacesFollowingService } from "./following/following.service";
import { CreateWorkspaceDto } from "./dto/create.workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update.workspace.dto";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UsersService } from "@modules/users/users.service";

@Controller("workspaces")
@ApiTags("workspaces")
export class WorkspaceController {
    constructor(
        readonly workspacesService: WorkspacesService,
        readonly workspacesFollowingService: WorkspacesFollowingService,
        readonly usersService: UsersService
    ) {}

    @Post()
    @ApiOperation({
        summary: "Create new workspace",
        description: "Create new workspace",
    })
    async create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
        try {
            const { userId } = createWorkspaceDto;

            //Check if user is authenticated.
            //TODO: replace validate user by current user
            const user = await this.usersService.getById(userId);
            if (!user) {
                throw new UnauthorizedException(HttpMessage.INVALID_DATA);
            }

            // Create new workspace
            const workspace = await this.workspacesService.create(
                createWorkspaceDto
            );

            return workspace;
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get()
    @ApiOperation({
        summary: "Get all workspaces",
        description: "Get all workspaces",
    })
    async getAll() {
        try {
            return await this.workspacesService.getAll();
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get workspace by id",
        description: "Get workspace by id",
    })
    @ApiParam({
        name: "id",
        type: "string",
    })
    async getById(@Param("id") id: string) {
        try {
            return await this.workspacesService.getById(id);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Patch(":id")
    @ApiOperation({
        summary: "Update a workspace by id",
        description: "Update a workspace by id",
    })
    async update(
        @Param("id") id: string,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto
    ) {
        try {
            const isWorkspaceExisted = await this.workspacesService.getById(id);
            if (!isWorkspaceExisted) {
                throw new BadRequestException(HttpMessage.INVALID_DATA);
            }

            // Update workspace
            const workspace = await this.workspacesService.update(
                id,
                updateWorkspaceDto
            );
            
            return workspace;
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete(":id")
    @ApiOperation({
        summary: "Delete a workspace",
        description: "Delete a workspace by id",
    })
    async delete(@Param("id") id: string) {
        try {
            const workspace = await this.workspacesService.getById(id);
            if (!workspace) {
                throw new BadRequestException(HttpMessage.INVALID_DATA);
            }

            //TODO: check user permission.
            await this.workspacesService.delete(workspace);
            
            return workspace;
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
