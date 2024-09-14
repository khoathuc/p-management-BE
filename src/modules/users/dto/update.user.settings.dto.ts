import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSettingsDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    location: string;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    status: number;
}
