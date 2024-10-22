import { SPACE_ROLE_KEY } from "@decorators/workspace.role.decorator";
import { WorkspacesFollowingService } from "@modules/workspaces/following/following.service";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WorkspaceRole } from "@prisma/base";

@Injectable()
export class SpaceRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private _spaceFsService: WorkspacesFollowingService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<WorkspaceRole[]>(
            SPACE_ROLE_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.session.user;
		const workspace = request.session.workspace;
        const space_fs = this._spaceFsService.getExport(user, workspace)

        return requiredRoles.some((role) => {
			if (role == 'Member'){
				return space_fs.isMember;
			}

			if (role == 'Admin'){
				return space_fs.isAdmin;
			}

			return false;
		});
    }
}
