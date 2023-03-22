import { IsBoolean, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    constructor() { }
    @IsNotEmpty()
    @MaxLength(10,{message:"name too long, please use passwords with a maximum of 10 characters"})
    @MinLength(4,{message:"name too short, please use passwords longer than 6 characters"})
    name: string;

}
