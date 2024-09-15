import { Injectable } from "@nestjs/common";
import { Invitation, Workspace } from "@prisma/client";
import { EmailService } from "@providers/email/mail.service";
import workspaceInvitation from "@providers/email/tpls/workspaceInvitation";
import { InvitationsModel } from "./invitations.model";
import { CreateInvitationData } from "./types";
import { Token } from "@shared/token";
import { DTC } from "@shared/dtc";
import { OBJ } from "@shared/object";

@Injectable()
export class InvitationService {
    static EXPIRED_DAYS = 24;

    constructor(
        private _invitationsModel: InvitationsModel,
        private _emailsService: EmailService
    ) {}

    export(invitation: Invitation) {
        return OBJ.pick(invitation, [
            "id",
            "workspaceId",
            "role",
            "email",
            "inviteAccepted",
            "expires",
            "data",
            "createdAt",
            "updatedAt",
        ]);
    }

    /**
     * @desc get invitation by email and workspaceId
     * @param email
     * @param workspace
     * @returns
     */
    async getByEmailAndWorkspace(
        email: string,
        workspace: Workspace
    ): Promise<Invitation> {
        return await this._invitationsModel.getByEmailAndWorkspace(
            email,
            workspace.id
        );
    }

    /**
     * @desc create invitation
     * @param createInvitationType
     * @returns
     */
    async create(data: CreateInvitationData) {
        return await this._invitationsModel.create(data);
    }

    /**
     * @desc send email invitation
     * @param {Invitation} invitation
     */
    async sendInvitationEmail(
        invitation: Invitation,
        data: { workspace?: Workspace }
    ) {
        const {workspace} = data;
        const workspaceName = workspace ? workspace.name : "---";
        const verification_link = `${process.env.FRONTEND_URL}?t=${invitation.token}`;

        // send email to invite
        await this._emailsService.sendEmail({
            to: invitation.email,
            subject: `Join ${workspaceName} on P`,
            template: workspaceInvitation({
                inviterEmail: invitation.email,
                workspaceName: workspaceName,
                link: verification_link,
            }),
        });
    }

    /**
     * @desc invite user email to workspace.
     */
    async invite(data: {
        workspace: Workspace;
        email: string;
        role: string;
    }): Promise<Invitation> {
        const { workspace, email, role } = data;

        // Get old invitation.
        // Delete old invitation is already invited
        const oldInvitation = await this._invitationsModel.getByEmailAndWorkspace(email, workspace.id)
        if(oldInvitation){
            await this._invitationsModel.deleteByEmailAndWorkspace(
                email,
                workspace.id
            );
        }

        // create new invitation
        const invitation = await this._invitationsModel.create({
            workspaceId: workspace.id,
            email: email,
            role: role,
            token: Token.generate(),
            expires: DTC.nextDays(InvitationService.EXPIRED_DAYS),
        });

        // Invite by email
        await this.sendInvitationEmail(invitation, {workspace});

        return invitation;
    }
}
