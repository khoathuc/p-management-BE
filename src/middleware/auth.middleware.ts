import { UsersService } from "@modules/users/users.service";
import { WorkspacesService } from "@modules/workspaces/workspaces.service";
import {
    HttpException,
    HttpStatus,
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

// TODO: use this middleware in non public controllers.
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private _jwtService: JwtService,
        private _workspaceService: WorkspacesService,
        private _userService: UsersService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            return next();
        }

        const token = this.extractAuthTokenFromReq(req);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const user_payload = await this._jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            if (!user_payload) {
                throw new UnauthorizedException();
            }

            const user = await this._userService.getById(user_payload.id);
            if (!user) {
                throw new UnauthorizedException();
            }

            req.session.user = user;

            // TODO: Check if user is activate, consider new class to manage user status.

            // TODO: write another middleware for workspace, decouple workspace from user.
            if (!req.session.workspace) {
                // get workspace_id from header first
                let spaceId = this.extractWorkspaceIdFromReq(req);

                if (!spaceId) {
                    spaceId = user.currentWorkspaceId;
                }

                if(spaceId){
                    const workspace = await this._workspaceService.getById(spaceId);

                    if(workspace) {
                        req.session.workspace = workspace;
                    }
                }

            }
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return next();
    }

    //TODO: make new class for authen utils.
    private extractAuthTokenFromReq(request: Request): string | undefined {
        if (request.headers.authorization) {
            return request.headers.authorization.split(" ")[1];
        }

        const auth_token = request.cookies.auth_token;
        return auth_token;
    }

    private extractWorkspaceIdFromReq(request: Request): string | undefined {
        if (request.cookies.workspaceId) {
            return request.cookies.workspaceId;
        }
    }
}
