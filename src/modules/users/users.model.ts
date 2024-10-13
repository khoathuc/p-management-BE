import { PrismaBaseService } from "@db/prisma.base.service";
import { Injectable } from "@nestjs/common";
import { Crypt } from "@shared/crypt";
import { RegisterDto } from "@modules/auth/dto/register.dto";
import { User, Workspace } from "@prisma/base";
import { UserStatus } from "@prisma/base";

@Injectable()
export class UsersModel {
    constructor(private _prismaService: PrismaBaseService) {}

    /**
     * @desc delete an user
     * @returns
     */
    async deleteById(id: string) {
        return await this._prismaService.user.delete({
            where: {
                id: id,
            },
        });
    }

    /**
     * @desc update an user
     * @param {string} id
     * @param {string} newPassword
     * @returns
     */
    async updatePassword(id: string, newPassword: string) {
        return await this._prismaService.user.update({
            where: {
                id: id,
            },
            data: {
                password: await Crypt.hash(newPassword, 10),
            },
        });
    }

    /**
     * @desc create new user
     * @param {RegisterDto} data
     * @returns
     */
    async create(data: RegisterDto): Promise<User> {
        const hashedPassword = await Crypt.hash(data.password, 10);

        return await this._prismaService.user.create({
            data: {
                email: data.email,
                username: data.username,
                password: hashedPassword,
                status: UserStatus.Active,
                emailVerified: false,
            },
        });
    }

    /**
     * @desc get all users
     * @returns
     */
    async getAll() {
        return await this._prismaService.user.findMany();
    }

    /**
     * @desc upload avatar
     * @param {User} user
     * @param {string} avatarUrl
     * @returns {Promise<User>}
     */
    async uploadAvatar(id: string, avatarUrl: string): Promise<User> {
        return this._prismaService.user.update({
            where: {
                id: id,
            },
            data: {
                avatar: avatarUrl,
            },
        });
    }

    /**
     * @desc get user by id
     * @param id
     * @returns
     */
    async getById(id: string): Promise<User> {
        return await this._prismaService.user.findUnique({
            where: { id },
        });
    }

    /**
     * @desc get user by email.
     * @param email
     * @returns
     */
    async getByEmail(email: string): Promise<User> {
        return await this._prismaService.user.findUnique({
            where: {
                email,
            },
        });
    }

    /**
     * @desc get users by ids
     * @param {String[]} ids
     * @return {User[]}
     */
    async getByIds(ids: string[]): Promise<User[]> {
        return await this._prismaService.user.findMany({
            where: { id: { in: ids } },
        });
    }

    /**
     * @desc get user by username or email.
     * @param { } email
     * @param { } username
     * @returns
     */
    async getByEmailOrUsername({ email, username }): Promise<User> {
        return await this._prismaService.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
    }

    /**
     * @desc update user emailVefify
     * @param {User} user
     * @returns
     */
    async updateEmailVerified(id: string) {
        return await this._prismaService.user.update({
            where: {
                id: id,
            },
            data: {
                emailVerified: true,
            },
        });
    }

    /**
     * @desc update user current workspace
     * @param {User} user
     * @param workspace 
     * @returns 
     */
    async updateCurrentWorkspace(user: User, workspace: Workspace) {
        return await this._prismaService.user.update({
            where: {
                id: user.id,
            },
            data: {
                currentWorkspaceId: workspace.id,
            },
        });
    }
}
