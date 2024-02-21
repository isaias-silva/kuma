import { IsNotEmpty, MaxLength, MinLength,IsOptional } from 'class-validator';

export class UpdateBotDto {
    constructor() { }
   
    @IsNotEmpty()
    @MaxLength(20, { message: "name too long, please use with a maximum of 10 characters" })
    @MinLength(4, { message: "name too short, please use longer than 4 characters" })
    name: string;
    
    @IsNotEmpty()
    apiKey: string;
}