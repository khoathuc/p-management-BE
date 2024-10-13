import { UserStatus } from "@prisma/base";

export interface AuthPayload {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    status: UserStatus;
    currentWorkspaceId: string;
    title: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}
