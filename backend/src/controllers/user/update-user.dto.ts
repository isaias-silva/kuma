import { IsBoolean, IsEmail, IsNotEmpty, MaxLength, MinLength, IsInstance, IsOptional } from 'class-validator';

export class UpdateUserDto {
    constructor() { }
    @IsInstance(Buffer, { message: 'profile is not file' })
    @IsOptional()
    profile?: Buffer

    @MaxLength(20, { message: "name too long, please use passwords with a maximum of 10 characters" })
    @MinLength(4, { message: "name too short, please use passwords longer than 4 characters" })
    @IsOptional()
    name?: string;

}
