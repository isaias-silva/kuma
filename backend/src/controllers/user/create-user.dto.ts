import { IsBoolean, IsEmail, IsNotEmpty, MaxLength, MinLength, Validate, ValidateIf } from 'class-validator';

export class CreateUserDto {
    constructor() { }
    @IsNotEmpty()
    @MaxLength(10,{message:"name too long, please use passwords with a maximum of 10 characters"})
    @MinLength(4,{message:"name too short, please use passwords longer than 6 characters"})
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;


    @MinLength(6,{message:"password too short, please use passwords longer than 6 characters"})
    @IsNotEmpty()
    password: string;


    @IsNotEmpty()
    @IsBoolean()
    adm: boolean;



}
