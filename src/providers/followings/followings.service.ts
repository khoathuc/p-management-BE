import { UsersService } from "@modules/users/users.service";
import { User } from "@prisma/base";
import { ARR } from "@shared/array";

export interface IFollowingsService<T extends { id: string }> {
    getExport(obj: T, user: User);
}

export abstract class AbstractFollowingsService<T extends { id: string }>
    implements IFollowingsService<T>
{
    private _model: any;

    constructor(model: any) {
        this._model = model;
    }

    /**
     * @desc create followings object from user and object
     * @param obj
     * @param users
     */
    async initFollowing(obj: T, users: User[]) {
        ARR.loop(users, async (user) => {
            const fsExport = this.getExport(obj, user);

            await this._model.create({
                data: {
                    ...fsExport,
                },
            });
        });
    }

    /**
     * @desc update followings object from user and object
     * @param obj
     * @param users
     */
    async updateFollowing(obj: T, users: User[]) {
        ARR.loop(users, async (user) => {
            const fsExport = this.getExport(obj, user);

            await this._model.workspaceFollowing.update({
                data: {
                    ...fsExport,
                },
                where: {
                    objectId_userId: {
                        objectId: obj.id,
                        userId: user.id,
                    },
                },
            });
        });
    }

    /**
     * @desc update following of object
     * @param obj
     * @param users
     */
    async removeFollowing(obj: T, users: User[]) {
        ARR.loop(users, async (user) => {
            await this._model.delete({
                where: {
                    objectId_userId: {
                        objectId: obj.id,
                        userId: user.id,
                    },
                },
            });
        });
    }

    abstract getExport(obj: T, user: User);
}
