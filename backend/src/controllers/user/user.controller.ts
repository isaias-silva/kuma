
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UserServices } from './user.services';
import { User } from './user.model';

@Controller('user')
export class UserController {
    constructor(private service: UserServices) {
    }
   
    @Get('findById/:id')
    @HttpCode(200 || 404)
    get(@Param() params) {
        return this.service.findById(params.id);
    }

    @Post('create')
    create(@Body() user: User) {
        return this.service.create(user);
    }

    @Put('update')
    update(@Body() user: User, @Body() id: string) {
        return this.service.update(id, user);
    }

    @Delete('delete/:id')
    remove(@Param() params) {
        return this.service.delete(params.id);
    }
}