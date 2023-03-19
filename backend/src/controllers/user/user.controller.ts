import { Controller,Get } from '@nestjs/common';

@Controller('user')
export class UserController {
@Get('/info')
Info():{message:string}{
return {message:'hi'}
}
}
