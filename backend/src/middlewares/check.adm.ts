import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class AdmMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    

    if (req["user"] && req["user"].adm == true) {
      next()

    } else {
      next(new HttpException('user is not adm', 401))
    }
  }
}