import {
    BadRequestException,
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { WorkspacesService } from "../workspaces.service";
import { UsersService } from "@modules/users/users.service";
import { CreateWorkspaceInvitationDto } from "./dto/create.invitation.dto";
import { InvitationService } from "./invitations.service";

@Controller("workspaces/:id/invitation")
@ApiTags("workspaces")
export class WorkspaceInvitationController {
    constructor(
        readonly workspacesService: WorkspacesService,
        readonly usersService: UsersService,
        readonly invitationService: InvitationService
    ) {}

    @Post()
    @ApiOperation({
        summary: "Invite to workspace",
        description: "Invite to workspace",
    })
    //TODO: implement invite with link
    async create(
        @Body() createWorkspaceInvitationDto: CreateWorkspaceInvitationDto
    ) {
        try {
            const { workspaceId, email, role } = createWorkspaceInvitationDto;
            const workspace = await this.workspacesService.getById(workspaceId);
            if (!workspace) {
                throw new BadRequestException("Invalid workspace");
            }

            // TODO: Check user permissions.
            const invitation = await this.invitationService.invite({
                workspace,
                email,
                role,
            });

            return {
                invitation: this.invitationService.export(invitation),
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
