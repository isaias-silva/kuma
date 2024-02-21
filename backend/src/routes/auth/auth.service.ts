import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { UserServices } from 'src/routes/user/user.services';

@Injectable()
export class AuthService {
    constructor(@Inject(UserServices)
    private readonly userServices: UserServices) { }
    async login(name: string, password: string) {
        try {

            const user = await this.userServices.getUserByName(name)

            if (!user || !user.password) {
                throw new HttpException('user not found', HttpStatus.NOT_FOUND)
            }
            if (await compare(password, user.password)) {
                const { name, adm, _id,} = user
                const token = jwt.sign({ name, adm, _id }, process.env.SECRET)
                return {token,message:'login is success'}
            } else {
                throw new HttpException('incorrect password', HttpStatus.UNAUTHORIZED)
            }
        } catch (err) {

            if (err.status) {
                throw new HttpException(err.message, err.status)
            } else {
                throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
            }

        }

    }
}
