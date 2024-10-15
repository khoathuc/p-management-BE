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
import { ContextService } from "@providers/context/context.service";
import { Request, Response, NextFunction } from "express";

// TODO: use this middleware in non public controllers.
@Injectable()
export class SessionMiddleware implements NestMiddleware {
    constructor(
        private _jwtService: JwtService,
        private _workspaceService: WorkspacesService,
        private _userService: UsersService,
        private _ctxService: ContextService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = this.extractAuthToken(req);
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

            this._ctxService.setUser(user);

            // TODO: Check if user is activate, consider new class to manage user status.
            if (user.currentWorkspaceId) {
                const workspace = await this._workspaceService.getById(
                    user.currentWorkspaceId
                );
                if (workspace) {
                    this._ctxService.setWorkspace(workspace);
                }
            }
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        next();
    }


    //TODO: make new class for authen utils.
    private extractAuthToken(request: Request): string | undefined {
        const auth_token = request.headers.auth || request.cookies.auth_token;
        return auth_token;
    }
}
