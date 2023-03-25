import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, MaxLength, MinLength, Validate, ValidateIf } from 'class-validator';

export class CreateUserDto {
    constructor() { }
    @IsNotEmpty()
    @MaxLength(10, { message: "name too long, please use passwords with a maximum of 10 characters" })
    @MinLength(4, { message: "name too short, please use passwords longer than 6 characters" })
    name: string;


    @MinLength(6, { message: "password too short, please use passwords longer than 6 characters" })
    @IsNotEmpty()
    password: string;


    @IsNotEmpty()
    @IsBoolean()
    adm: boolean;

    @IsNotEmpty()
    @IsBoolean()
    active_service: boolean;

    @IsNotEmpty()
    @IsNumber()
    days_use: number


}
