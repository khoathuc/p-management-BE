import { AuthPayload } from "@interfaces/auth.payload";
import { RegisterDto } from "@modules/auth/dto/register.dto";
import { Injectable } from "@nestjs/common";
import { User, UserStatus } from "@prisma/client";
import { UsersModel } from "./users.model";
import { OBJ } from "@shared/object";

@Injectable()
export class UsersService {
    constructor(private _userModel: UsersModel) {}

    /**
     * @desc release user payload
     */
    releasePayload(user: User): AuthPayload {
        return OBJ.pick(user, [
            "id",
            "firstName",
            "lastName",
            "username",
            "email",
            "currentWorkspaceId"
        ]);
    }
    
    /**
     * @desc get all users
     * @returns
     */
    async getAll(): Promise<User[]> {
        return await this._userModel.getAll();
    }

    /**
     * @desc upload avatar
     * @param {User} user
     * @param {string} avatarUrl
     * @returns {Promise<User>}
     */
    async uploadAvatar(user: User, avatarUrl: string): Promise<User> {
        return await this._userModel.uploadAvatar(user.id, avatarUrl);
    }

    /**
     * @desc get user by id
     * @param id
     * @returns
     */
    async getById(id: string): Promise<User> {
        return await this._userModel.getById(id);
    }

    /**
     * @desc get user by email.
     * @param email
     * @returns
     */
    async getByEmail(email: string): Promise<User> {
        return await this._userModel.getByEmail(email);
    }

    /**
     * @desc get users by ids
     * @return {User[]}
     */
    async getByIds(ids: string[]): Promise<User[]> {
        return await this._userModel.getByIds(ids);
    }

    /**
     * @desc get user by username or email.
     * @returns
     */
    async getByEmailOrUsername({ email, username }): Promise<User> {
        return await this._userModel.getByEmailOrUsername({ email, username });
    }

    /**
     * @desc create new user
     * @param {RegisterDto} data
     * @returns
     */
    async create(data: RegisterDto): Promise<User> {
        return await this._userModel.create(data);
    }

    /**
     * @desc user update password
     * @param {User} user
     * @param {string} newPassword
     * @returns
     */
    async updatePassword(user: User, newPassword: string) {
        return await this._userModel.updatePassword(user.id, newPassword);
    }

    /**
     * @desc delete user by id
     * @param id
     * @returns
     */
    async deleteById(id: string) {
        return await this._userModel.deleteById(id);
    }

    /**
     * @desc update user emailVefify
     * @param {User} user
     * @returns
     */

    async updateEmailVerified(user: User){
        return await this._userModel.updateEmailVerified(user.id);
    }
}
