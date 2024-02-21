import { Body, Controller, Post, Res } from '@nestjs/common';
import { ResponseOfRequest } from 'src/utils/ResponseOfRequest';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {
    }
    @Post("/login")
    async login(@Body() body, @Res() res) {
      
        return await this.service.login(body.name, body.password)
    }
}
