
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { UserServices } from './user.services';
import { User } from './user.model';
import { ResponseOfRequest } from 'src/utils/ResponseOfRequest';
import { validateSync } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

@Controller('user')
export class UserController {
    constructor(private service: UserServices) {
    }

    @Get('me')
    async get(@Param() params, @Req() req, @Res() res) {
        return new ResponseOfRequest('info of user', 200).sendResponse(res, req['user'])
    }

    @Post('create')
    async create(@Body() user: User, @Res() res) {

        const validatedUser = new CreateUserDto()
        validatedUser.name = user.name
        validatedUser.email = user.email
        validatedUser.password = user.password
        validatedUser.adm = false;


        const erros = validateSync(validatedUser)
        if (erros.length > 0) {
            return new ResponseOfRequest('error in create user', HttpStatus.BAD_REQUEST).sendResponse(res, erros.map(value => value.constraints))
        }
        const result = await this.service.create(user);
        return new ResponseOfRequest('user created', HttpStatus.OK).sendResponse(res, result)
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