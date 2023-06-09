import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { BotServices } from './bot.services';
import { ResponseOfRequest } from 'src/utils/ResponseOfRequest';
import { TelBot } from './bot.schema';
import { CreateBotDto } from './create-bot.dto';
import { validateSync } from 'class-validator';
import { UpdateBotDto } from './update-bot.dto';

@Controller('bot')
export class BotController {
    constructor(private service: BotServices) { }
    @Get('all')
    async getBots(@Req() req, @Res() res) {
        const result = await this.service.getMybots(req['user']._id)
        return new ResponseOfRequest('your bots', 200).sendResponse(res, result)
    }
    @Get('/:id')
    async getBot(@Req() req, @Res() res, @Param('id') id) {

        const result = await this.service.getBot(req['user']._id, id)
        return new ResponseOfRequest('your bot', 200).sendResponse(res, result)
    }
    @Post('/create')
    async create(@Req() req, @Res() res, @Body() bot: TelBot) {

        const validatedBot = new CreateBotDto()
        validatedBot.name = bot.name,
            validatedBot.apiKey = bot.apiKey
        const erros = validateSync(validatedBot)
        if (erros.length > 0) {
            return new ResponseOfRequest('error in create bot', HttpStatus.BAD_REQUEST).sendResponse(res, erros.map(value => value.constraints))
        }

        await this.service.createBot(req["user"]._id, bot)

        return new ResponseOfRequest('bot created', 200).sendResponse(res, {})
    }
    @Put('/update')
    async update(@Req() req, @Res() res, @Body() body: TelBot) {
        const { telegram_name, name, apiKey } = body
        const validatedBot = new UpdateBotDto()
        validatedBot.name = name
        validatedBot.apiKey = apiKey

        const erros = validateSync(validatedBot)
        if (erros.length > 0) {
            return new ResponseOfRequest('error in updated bot', HttpStatus.BAD_REQUEST).sendResponse(res, erros.map(value => value.constraints))
        }
        await this.service.updateBotNames(req["user"]._id, validatedBot)

        return new ResponseOfRequest('bot updated', 200).sendResponse(res, {})
    }
    @Delete('/delete')
    async delete(@Req() req, @Res() res, @Body() body) {
        await this.service.deleteBot(req["user"]._id, body.id)
        return new ResponseOfRequest('bot deleted', 200).sendResponse(res, {})

    }
    @Post('/create_command')
    async createCommand(@Req() req, @Res() res, @Body() body) {
        await this.service.createBotCommand(body.apiKey, body.command, body.description)
        return new ResponseOfRequest(`command '${body.command}' create`, 200).sendResponse(res, {})

    }
    @Delete('/delete_command')
    async deleteCommand(@Req() req, @Res() res, @Body() body) {
        await this.service.deleteBotCommand(body.apiKey, body.command)
        return new ResponseOfRequest(`command '${body.command}' deleted`, 200).sendResponse(res, {})

    }
}
