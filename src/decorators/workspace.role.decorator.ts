
import { SetMetadata } from '@nestjs/common';
import { WorkspaceRole } from '@prisma/base';

export const SPACE_ROLE_KEY = 'spaceRoles';
export const SpaceRoles = (...roles: WorkspaceRole[]) => SetMetadata(SPACE_ROLE_KEY, roles);
