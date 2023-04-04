import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateBotDto {
    constructor() { }
    @IsNotEmpty()
    @MaxLength(20, { message: "name too long, please use passwords with a maximum of 10 characters" })
    @MinLength(4, { message: "name too short, please use passwords longer than 4 characters" })
    name: string;
    @IsNotEmpty()
    apiKey: string;
}