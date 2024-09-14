import { CreateWorkspaceInvitationDto } from "../dto/create.invitation.dto";

export type CreateInvitationData = CreateWorkspaceInvitationDto & {
    token: string;
    expires: Date;
};
