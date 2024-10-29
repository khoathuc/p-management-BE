import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserPersonalInfoDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    firstName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    lastName: string;

    @IsOptional()
    @ApiProperty()
    title: string;

    @IsOptional()
    @ApiProperty()
    location: string;
}
