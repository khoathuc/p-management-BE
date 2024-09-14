import { Module } from "@nestjs/common";
import { WorkspaceController } from "./workspaces.controller";
import { WorkspacesService } from "./workspaces.service";
import { PrismaModule } from "@db/prisma.module";
import { UsersModule } from "@modules/users/users.module";
import { WorkspacesFollowingService } from "./following/following.service";
import { WorkspaceInvitationController } from "./invitation/invitation.controller";
import { InvitationService } from "./invitation/invitations.service";
import { EmailModule } from "@providers/email/email.module";
import { WorkspacesModel } from "./workspaces.model";
import { InvitationsModel } from "./invitation/invitations.model";

@Module({
    imports: [PrismaModule, UsersModule, EmailModule],
    controllers: [WorkspaceController, WorkspaceInvitationController],
    providers: [
        WorkspacesService,
        WorkspacesModel,
        WorkspacesFollowingService,
        InvitationService,
        InvitationsModel,
    ],
    exports: [WorkspacesService, WorkspacesFollowingService],
})
export class WorkspaceModule {}
