import { PrismaBaseService } from "@db/prisma.base.service";
import { Workspace } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { CreateWorkspaceDto } from "./dto/create.workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update.workspace.dto";
@Injectable()
export class WorkspacesModel {
    constructor(private _prismaService: PrismaBaseService) {}

    /**
     * @desc delete a workspace
     * @returns
     */
    async delete(id: string) {
        return await this._prismaService.workspace.delete({
            where: { id },
        });
    }

    /**
     * @desc get all workspaces
     * @returns
     */
    async getAll() {
        return await this._prismaService.workspace.findMany();
    }

    /**
     * @desc get workspace by id
     * @param string id
     * @returns
     */
    async getById(id: string): Promise<Workspace> {
        return await this._prismaService.workspace.findUnique({
            where: { id },
        });
    }

    /**
     * @desc create new workspace
     * @param data
     */
    async create(data: CreateWorkspaceDto): Promise<Workspace> {
        return await this._prismaService.workspace.create({
            data: {
                ...data,
            },
        });
    }

    /**
     * @desc update workspace
     * @param {string} id
     * @param {UpdateWorkspaceDto} data
     */
    async update(id, data: UpdateWorkspaceDto): Promise<Workspace> {
        return await this._prismaService.workspace.update({
            data: {
                ...data,
            },
            where: { id },
        });
    }
}
