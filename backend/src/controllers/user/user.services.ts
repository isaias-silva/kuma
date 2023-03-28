
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken'
import { scheduleJob } from "node-schedule";
import { Model } from 'mongoose';
import { User } from './user.model';
import { hash } from 'bcrypt'
import { UpdateUserDto } from './update-user.dto';
import axios from 'axios';
import { FgBlue, FgGreen, FgRed, FgYellow, Reset } from 'src/utils/colors';
@Injectable()
export class UserServices {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
  }

  async allusers() {
    const allUsers = await this.userModel.find({})
    const result = allUsers.map((user) => {
      const { name, id, apiKey, adm, active_service, days_use } = user
      const formatUser = { name, id, apiKey, adm, active_service, days_use }

      return formatUser
    })
    console.log(FgBlue + `[!] all user consult` + Reset)
    return result
  }


  async create(doc: User) {
    console.log(FgBlue + `[!] create user: ${doc.name}` + Reset)
    try {
      const existingUser = await this.checkUserWithName(doc.name);

      if (existingUser) {
        const error = new Error('userName exists');
        error.name = 'ConflictError';
        throw error;
      }

      const formattedUser = { ...doc };
      const salt = 10;
      formattedUser.password = await hash(formattedUser.password, salt);


      const result = await new this.userModel(formattedUser).save();
      const { apiKey, adm, name, _id, active_service, days_use } = result
      const token = jwt.sign({ apiKey, adm, name, _id, active_service, days_use }, process.env.SECRET)
      this.getJob(result, result.id)
      console.log(FgGreen + `[!] sucess!` + Reset)
      return token
    } catch (err) {
      console.log(FgRed + `[!] error\n ${err}` + Reset)
      if (err.name === 'ConflictError') {
        throw new HttpException(err.message, HttpStatus.CONFLICT);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  }

  async update(id: string, updateUser: UpdateUserDto) {
    console.log(FgBlue + `[!] updating user for id: ${id}` + Reset)
    try {
      const exist = await this.userModel.findOne({ name: updateUser.name })
      if (exist) {
        throw new HttpException('user name exists', 409)
      }
      await this.userModel.updateOne({ _id: id }, updateUser)
      console.log(FgGreen + `[!] sucess!` + Reset)
      return
    } catch (err) {
      console.log(FgRed + `[!] error\n${err}` + Reset)
      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async delete(id: string) {
    console.log(FgBlue + `[!] delete user: ` + Reset)
    try {
      const exist = await this.userModel.findById(id)
      if (!exist) {
        throw new HttpException('user not found', 404)
      }
      console.log(FgYellow + `[!] name: ${exist.name}` + Reset)
      await this.userModel.deleteOne({ _id: id })
      console.log(FgGreen + `[!] sucess!` + Reset)
      return
    } catch (err) {
      console.log(FgGreen + `[!] error \n${err}` + Reset)
      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: string) {

    const exist = await this.userModel.findById(id)
    if (!exist) {
      return
    }
    const { name, _id, adm, apiKey, active_service, days_use, profile } = exist
    console.log(FgBlue + `[!] get user: ${name}\n[!] adm: ${adm}` + Reset)
    return {
      name,
      _id,
      adm,
      apiKey,
      active_service,
      days_use,
      profile: profile ? `data:image/png;base64,${profile.toString('base64')}` : null
    }
  }

  async getUserByName(name: string) {

    const exist = await this.userModel.findOne({ name })
    if (!exist) {
      return
    }

    return exist
  }
  async checkUserWithName(name: string) {
    const exist = await this.userModel.findOne({
      $or: [
        { name }]
    })

    return exist ? true : false

  }
  async setTelegramApiKey(apiKey: string, userId: string) {
    try {

      const test = await axios.get(`https://api.telegram.org/bot${apiKey}/getMe`)


      console.log(test)
      if (test.status != 200) {

        throw new HttpException('invalid api key', HttpStatus.BAD_REQUEST)
      }
      const exist = await this.userModel.findById(userId)
      if (!exist) {
        throw new HttpException('user not found', 404)
      }
      await this.userModel.updateOne({ _id: userId }, { apiKey })

      return apiKey
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async renovateUser(id: string) {
    try {
      const user = await this.userModel.findById(id)
      if (!user) {
        throw new HttpException('user not found', 404)
      }

      await this.userModel.updateOne({ _id: user.id }, { days_use: 10, active_service: true })
      this.getJob(user, user.id)
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getJob(user: User, _id: string) {
    if (user.adm || !user.active_service) {
      return
    }

    const userModel = this.userModel

    const job = scheduleJob("0 0 * * *", async function () {
      const userUpdate = await userModel.findById(_id)
      const { days_use } = userUpdate

      const newDayUse = days_use > 0 ? days_use - 1 : 0

      if (newDayUse == 0) {
        await userModel.updateOne({ _id }, { days_use: newDayUse, active_service: false })
        job.cancel()
      } else {
        await userModel.updateOne({ _id }, { days_use: newDayUse })

      }
    });
  }
}