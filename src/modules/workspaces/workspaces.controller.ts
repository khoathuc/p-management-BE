import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Delete,
    Patch,
    HttpException,
    HttpStatus,
    BadRequestException,
} from "@nestjs/common";
import { HttpMessage } from "@common/constants/http.message";
import { WorkspacesService } from "./workspaces.service";
import { CreateWorkspaceDto } from "./dto/create.workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update.workspace.dto";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import AuthUser from "@decorators/auth.decorator";
import { SpaceRoles } from "@decorators/workspace.role.decorator";
import { WorkspaceRole } from "@prisma/base";
import CurrentWorkspace from "@decorators/workspace.decorator";

@Controller("workspaces")
@ApiTags("workspaces")
export class WorkspaceController {
    constructor(private readonly _workspacesService: WorkspacesService) {}

    /**
     * @param createWorkspaceDto
     * @returns
     */
    @Post()
    @ApiOperation({
        summary: "Create new workspace",
        description: "Create new workspace",
    })
    async create(
        @AuthUser() user,
        @Body() createWorkspaceDto: CreateWorkspaceDto
    ) {
        try {
            // Create new workspace
            const workspace = await this._workspacesService.create(
                user,
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
        summary: "Get current workspace",
        description: "Get current workspace in session",
    })
    async getCurrentWorkspace(@CurrentWorkspace() workspace) {
        return { workspace };
    }

    @Get()
    @ApiOperation({
        summary: "Get all workspaces",
        description: "Get all workspaces",
    })
    async getAll(@AuthUser() user) {
        try {
            return await this._workspacesService.getAll(user);
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
            // TODO: Check if user can see this workspace
            return await this._workspacesService.getById(id);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Patch(":id")
    @SpaceRoles(WorkspaceRole.Admin)
    @ApiOperation({
        summary: "Update a workspace by id",
        description: "Update a workspace by id",
    })
    async update(
        @AuthUser() user,
        @Param("id") id: string,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto
    ) {
        try {
            const isWorkspaceExisted = await this._workspacesService.getById(
                id
            );
            if (!isWorkspaceExisted) {
                throw new BadRequestException(HttpMessage.INVALID_DATA);
            }
            // Check if user can update this workspace.

            // Update workspace
            const workspace = await this._workspacesService.update(
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
            const workspace = await this._workspacesService.getById(id);
            if (!workspace) {
                throw new BadRequestException(HttpMessage.INVALID_DATA);
            }

            //TODO: check user permission.
            await this._workspacesService.delete(workspace);

            return workspace;
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
