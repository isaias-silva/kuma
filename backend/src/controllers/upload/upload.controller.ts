import { Body, Controller, HttpException, HttpStatus, Inject, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseOfRequest } from 'src/utils/ResponseOfRequest';
import { UserServices } from '../user/user.services';
import { BotServices } from '../bot/bot.services';
import generateFormData from 'src/utils/generateFormData';

@Controller('upload')
export class UploadController {
  constructor(
    @Inject(UserServices) private readonly userServices: UserServices,
    @Inject(BotServices) private readonly botServices: BotServices,
  ) { }

  @Put('profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Req() req, @Res() res) {
try{
    if (file) {
      const profile: Buffer = file.buffer;
      await this.userServices.update(req["user"]._id, { profile })
      return new ResponseOfRequest('profile updated', HttpStatus.OK).sendResponse(res, {})
    }else{
      throw new HttpException("file type not supported" , HttpStatus.BAD_REQUEST)
    }
  }catch(err){
  
    throw new HttpException(err.message||"internal Error" , err.status|| HttpStatus.INTERNAL_SERVER_ERROR)
    
  }

  }
  @Put('telegramBotProfile')
  @UseInterceptors(FileInterceptor("file"))
  async uploadprofile(

    @UploadedFile() file,
    @Req() req, @Res() res,
    @Body('botToken') botToken) {
      try{
    if (file) {
      const profile: Buffer = file.buffer;
      const arrayBuffer = new Uint8Array(profile).buffer
      const blob = new Blob([arrayBuffer])
      const formData = await generateFormData(blob, [{ title: 'botToken', value: botToken }])
    await this.botServices.updateBotProfile(formData);
    return new ResponseOfRequest('profile bot updated', HttpStatus.OK).sendResponse(res, {})
    }else{
      throw new HttpException("file type not supported" , HttpStatus.BAD_REQUEST)
    }
  }catch(err){
    throw new HttpException(err.message||"internal Error" , err.status|| HttpStatus.INTERNAL_SERVER_ERROR)
    
  }


  }

}
