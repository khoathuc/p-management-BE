import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"
export class UpdateWorkspaceDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    logo?: string;

    @IsArray()
    @IsString({ each: true })
    @ApiPropertyOptional()
    members: string[];

    @IsArray()
    @IsString({ each: true })
    @ApiPropertyOptional()
    owners: string[];

    @IsArray()
    @IsString({ each: true })
    @ApiPropertyOptional()
    admins: string[];
}
