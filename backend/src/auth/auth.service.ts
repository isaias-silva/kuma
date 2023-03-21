import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserServices } from 'src/controllers/user/user.services';

@Injectable()
export class AuthService {
    constructor(@Inject(UserServices)
    private readonly userServices: UserServices) { }
    async validateUser(email: string, password: string) {
        try {

            const user = await this.userServices.getUserByEmail(email)

            if (!user || !user.password) {
                throw new HttpException('user not found', HttpStatus.NOT_FOUND)
            }
            if (await compare(password, user.password)) {
                return "nice"
            } else {
                throw new HttpException('incorrect password', HttpStatus.UNAUTHORIZED)
            }
        } catch (err) {

            if (err.status) {
                throw new HttpException(err.message, err.status)
            }else{
                throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
            }

        }

    }
}
