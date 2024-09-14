import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string
    
	@IsEmail()
	@IsNotEmpty()
    @ApiProperty()
    email: string

	@IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    password: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    logo?: string;
}