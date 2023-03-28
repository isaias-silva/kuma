import { Body, Controller, Post, Res } from '@nestjs/common';
import { ResponseOfRequest } from 'src/utils/ResponseOfRequest';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {
    }
    @Post("/login")
    async login(@Body() body, @Res() res) {
        const token = await this.service.validateUser(body.name, body.password)
        return new ResponseOfRequest('login is sucess', 201).sendResponse(res, { token })
    }
}
