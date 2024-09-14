import { PrismaService } from "@db/prisma.service";
import { Injectable } from "@nestjs/common";
import { User, Workspace } from "@prisma/client";
import { ARR } from "@shared/array";
import {
    AbstractFollowingsService,
    IFollowingsService,
} from "@providers/followings/followings.service";
import { UsersService } from "@modules/users/users.service";

@Injectable()
export class WorkspacesFollowingService
    extends AbstractFollowingsService<Workspace>
    implements IFollowingsService<Workspace>
{
    constructor(
        private _usersService: UsersService,
        private _prismaService: PrismaService
    ) {
        super(_prismaService.workspaceFollowing);
    }

    /**
     * @desc get export following data
     * @param workspace
     * @param user
     * @returns
     */
    getExport(workspace: Workspace, user: User) {
        const creating = workspace.userId == user.id ? true : false;

        var ownering = false;
        if (workspace.owners.length > 0) {
            ownering = ARR.contain(workspace.owners, user.id) ? true : false;
        }

        var isMember = false;
        if (workspace.members.length > 0) {
            isMember = ARR.contain(workspace.members, user.id) ? true : false;
        }

        var isAdmin = false;
        if (workspace.admins.length > 0) {
            isAdmin = ARR.contain(workspace.admins, user.id) ? true : false;
        }

        return {
            objectId: workspace.id,
            userId: user.id,

            name: workspace.name,
            logo: workspace.logo,

            creating,
            ownering,

            isAdmin,
            isMember,

            data: workspace.data,
        };
    }

    /**
     * @desc create new workspace following
     * @param workspace
     */
    async init(workspace: Workspace) {
        // Get users
        const user_ids = ARR.merge([
            [workspace.userId],
            workspace.owners,
            workspace.members,
            workspace.members,
        ]);

        const users = await this._usersService.getByIds(user_ids);
        await this.initFollowing(workspace, users);
    }

    /**
     * @desc update workspaces following
     * @param workspace
     */
    async update(workspace: Workspace) {
        // Get users
        const user_ids = ARR.merge([
            [workspace.userId],
            workspace.owners,
            workspace.members,
            workspace.members,
        ]);

        const users = await this._usersService.getByIds(user_ids);
        await this.updateFollowing(workspace, users);
    }

    /**
     * @desc remove workspaces following
     * @param workspace
     */
    async remove(workspace: Workspace) {
        // Get users
        const user_ids = ARR.merge([
            [workspace.userId],
            workspace.owners,
            workspace.members,
            workspace.members,
        ]);

        const users = await this._usersService.getByIds(user_ids);
        await this.removeFollowing(workspace, users);
    }
}
