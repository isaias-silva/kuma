import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserServices } from 'src/routes/user/user.services';


@Injectable()
export class planMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserServices) {
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.userService.getUserById(req["user"].id)
    if (user.active_service) {
      next()
    } else {
      next(new HttpException('service expired', 401))
    }
  }
}