import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
} from "class-validator";
import { WorkspaceRole } from "@prisma/base";

export class CreateWorkspaceInvitationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    workspaceId: string;

    @IsString()
    @IsEnum(WorkspaceRole)
    @ApiProperty()
    role: WorkspaceRole;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}
