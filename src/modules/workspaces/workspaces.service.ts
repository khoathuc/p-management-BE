import { Injectable } from "@nestjs/common";
import { WorkspacesFollowingService } from "./following/following.service";
import { Workspace } from "@prisma/client";
import { WorkspacesModel } from "./workspaces.model";
import { CreateWorkspaceDto } from "./dto/create.workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update.workspace.dto";
import { OBJ } from "@shared/object";

@Injectable()
export class WorkspacesService {
    constructor(
        private _workspacesModel: WorkspacesModel,
        private _fs: WorkspacesFollowingService
    ) {}

    /**
     * @desc export workspace
     */
    export(workspace: Workspace) {
        return OBJ.pick(workspace, ["id", "name"]);
    }

    /**
     * @desc get workspace by id
     * @param id
     * @returns {Workspace}
     */
    getById(id: string) {
        return this._workspacesModel.getById(id);
    }

    /**
     * @desc get all workspaces
     * @return {Workspace[]}
     */
    getAll() {
        return this._workspacesModel.getAll();
    }

    /**
     * @desc create workspace
     * @return {Workspace}
     */
    async create(workspaceDto: CreateWorkspaceDto) {
        const workspace = await this._workspacesModel.create(workspaceDto);

        // Create workspace following
        await this._fs.init(workspace);

        return workspace;
    }

    /**
     * @desc update workspace
     * @return {Workspace}
     */
    async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
        const workspace = await this._workspacesModel.update(
            id,
            updateWorkspaceDto
        );

        await this._fs.update(workspace);

        return workspace;
    }

    /**
     * @desc
     */
    async delete(workspace: Workspace) {
        // Delete workspace
        await this._workspacesModel.delete(workspace.id);

        // Remove following
        await this._fs.remove(workspace);
    }
}
