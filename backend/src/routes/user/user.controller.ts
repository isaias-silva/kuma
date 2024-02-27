
import {
    Body,
    Controller,
    Delete,
    Get,

    Post,
    Put,
    Req,
} from '@nestjs/common';
import { UserServices } from './user.services';
import { CreateUserDto } from './create.user.dto';
import { UpdateUserDto } from './update.user.dto';
import { Request } from 'express';


@Controller('user')
export class UserController {
    constructor(private service: UserServices) {
    }
    @Get('me')

    async getUser(@Req() req: Request) {

        return await this.service.getUserById(req["user"]._id)

    }
    @Get('all')

    async getAllUsers() {
        return await this.service.allusers()


    }
    @Post('register')
    @Post('create')
    async create(@Body() user: CreateUserDto) {

        return await this.service.create(user);

    }

    @Put('update')
    async update(@Body() user: UpdateUserDto, @Req() req: Request) {

        return await this.service.update(req['user']._id, user)

    }

    @Delete('delete')

    async remove(@Body() body, @Req() req: Request) {

        return await this.service.delete(body.id);


    }


}