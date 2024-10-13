import { PrismaBaseService } from "@db/prisma.base.service";
import { Injectable } from "@nestjs/common";
import { Invitation } from "@prisma/base";

@Injectable()
export class InvitationsModel {
    constructor(private _prismaService: PrismaBaseService) {}

    /**
     * @desc get all invitations
     * @returns
     */
    async getAll() {
        return await this._prismaService.invitation.findMany();
    }

    /**
     * @desc get invitation by id
     * @param string id
     * @returns
     */
    async getById(id: string): Promise<Invitation> {
        return await this._prismaService.invitation.findUnique({
            where: { id },
        });
    }

    /**
     * @desc get invitation by email
     * @param string email
     * @param string workspaceId
     * @returns
     */
    async getByEmailAndWorkspace(
        email: string,
        workspace_id: string
    ): Promise<Invitation> {
        return await this._prismaService.invitation.findUnique({
            where: {
                workspaceId_email: {
                    email,
                    workspaceId: workspace_id,
                },
            },
        });
    }

    /**
     * @desc create new invitation
     * @param data
     */
    async create(data): Promise<Invitation> {
        return await this._prismaService.invitation.create({
            data: {
                ...data,
            },
        });
    }

    /**
     * @desc delete by email and workspace
     */
    async deleteByEmailAndWorkspace(email: string, workspaceId: string) {
        return await this._prismaService.invitation.delete({
            where: {
                workspaceId_email: {
                    workspaceId,
                    email,
                },
            },
        });
    }
}
