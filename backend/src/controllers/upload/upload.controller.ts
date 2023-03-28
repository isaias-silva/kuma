import { Controller, HttpStatus, Inject, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseOfRequest } from 'src/utils/ResponseOfRequest';
import { UserServices } from '../user/user.services';

@Controller('upload')
export class UploadController {
  constructor(@Inject(UserServices)
  private readonly userServices: UserServices) { }

  @Put('profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Req() req, @Res() res) {
  
    if (file) {
      const profile: Buffer = file.buffer;
      await this.userServices.update(req["user"]._id, { profile })
    }

    return new ResponseOfRequest('profile updated', HttpStatus.OK).sendResponse(res, { })
    // Lógica para lidar com o arquivo aqui
  }
}
