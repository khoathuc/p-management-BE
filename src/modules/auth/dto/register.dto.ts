import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    MinLength,
    IsNotEmpty,
    MaxLength,
} from "class-validator";
export class RegisterDto {
    @IsEmail({}, { message: "Invalid email" })
    @MaxLength(255, {message: "Email is too long"})
    @ApiProperty()
    email: string;

    @MinLength(5, {message: "Username is too short, min length is 5 characters"})
    @MaxLength(255, {message: "Username is too long"})
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @MaxLength(255, {message: "Password is too long"})
    @MinLength(6, {message: "Password is too short, min length is 6 characters"})
    @ApiProperty()
    password: string;
}
