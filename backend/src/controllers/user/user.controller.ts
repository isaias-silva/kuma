
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UserServices } from './user.services';
import { User } from './user.model';
import { ResponseOfRequest } from 'src/utils/ResponseOfRequest';
import { validateSync } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { AdmMiddleware } from 'src/middlewares/check.adm';

@Controller('user')
export class UserController {
    constructor(private service: UserServices) {
    }
    @Get('me')

    async getUser(@Param() params, @Req() req, @Res() res) {
        const result = await this.service.getUserById(req["user"]._id)
        return new ResponseOfRequest('info of user', 200).sendResponse(res, result)
    }
    @Get('all')
    async getAllUsers(@Res() res) {
        const result = await this.service.allusers()
        return new ResponseOfRequest('info of user', 200).sendResponse(res, result)

    }
    @Post('create')

    async create(@Body() user: User, @Res() res) {

        const validatedUser = new CreateUserDto()
        validatedUser.name = user.name
        validatedUser.password = user.password
        validatedUser.adm = false;


        const erros = validateSync(validatedUser)
        if (erros.length > 0) {
            return new ResponseOfRequest('error in create user', HttpStatus.BAD_REQUEST).sendResponse(res, erros.map(value => value.constraints))
        }
        const result = await this.service.create(validatedUser);
        return new ResponseOfRequest('user created', HttpStatus.OK).sendResponse(res, result)
    }


    @Put('update')
    async update(@Body() user: User, @Req() req, @Res() res) {
        const validatedUser = new UpdateUserDto()
        validatedUser.name = user.name
        const erros = validateSync(validatedUser)
        if (erros.length > 0) {
            return new ResponseOfRequest('error in create user', HttpStatus.BAD_REQUEST).sendResponse(res, erros.map(value => value.constraints))
        }
        const token = await this.service.update(req['user']._id, validatedUser)

        return new ResponseOfRequest('user updated', HttpStatus.OK).sendResponse(res, token)
    }

    @Put('addTelegramApiKey')
    async addTelegramApi(@Body() body: { apiKey: string }, @Req() req, @Res() res) {
        const { apiKey } = body
        if(!apiKey){
            return new ResponseOfRequest('invalid token', HttpStatus.BAD_REQUEST).sendResponse(res, {})
  
        }
        await this.service.setTelegramApiKey(apiKey, req["user"]._id)
        return new ResponseOfRequest('telegram api key updated', HttpStatus.OK).sendResponse(res, {});
    }
    @Delete('delete')
    async remove(@Body() body, @Req() req, @Res() res) {
        if (req["user"]._id == body.id) {
            return new ResponseOfRequest('is imposible to delete your self', 400).sendResponse(res, null)
        }
        await this.service.delete(body.id);

        return new ResponseOfRequest('user deleted', HttpStatus.OK).sendResponse(res, { id: body.id })
    }
}