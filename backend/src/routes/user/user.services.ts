
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken'
import { scheduleJob } from "node-schedule";
import { Model } from 'mongoose';
import { User } from './user.model';
import { hash } from 'bcrypt'
import { UpdateUserDto } from './update-user.dto';
import * as fs from 'fs';


@Injectable()
export class UserServices {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
  }

  async allusers() {
    const allUsers = await this.userModel.find({})
    const result = allUsers.map((user) => {
      const { name, id, adm, active_service, days_use } = user
      const formatUser = { name, id, adm, active_service, days_use }

      return formatUser
    })

    return result
  }


  async create(doc: User) {

    try {
      const existingUser = await this.checkUserExistWithNameOrMail(doc.name, doc.email);

      if (existingUser) {
        throw new BadRequestException("user already exists")
      }

      const formattedUser = { ...doc };
      const salt = 10;

      formattedUser.password = await hash(formattedUser.password, salt);
      formattedUser.profile = fs.readFileSync('./src/assets/profile.png')

      const result = await new this.userModel(formattedUser).save();

      const { adm, name, _id, active_service, days_use } = result

      const token = jwt.sign({ adm, name, _id, active_service, days_use }, process.env.SECRET)

      this.startJob(result, result.id)

      return token
    } catch (err) {

      throw err
    }

  }

  async update(id: string, updateUser: UpdateUserDto) {

    try {
      const exist = await this.userModel.findOne({ name: updateUser.name })
      if (exist) {
        throw new HttpException('user name exists', 409)
      }
      await this.userModel.updateOne({ _id: id }, updateUser)

      return
    } catch (err) {

      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async delete(id: string) {

    try {
      const exist = await this.userModel.findById(id)
      if (!exist) {
        throw new HttpException('user not found', 404)
      }

      await this.userModel.deleteOne({ _id: id })

      return
    } catch (err) {

      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: string) {

    const exist = await this.userModel.findById(id)
    if (!exist) {
      return
    }
    const { name, _id, adm, active_service, days_use, profile } = exist

    return {
      name,
      _id,
      adm,
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
  private async checkUserExistWithNameOrMail(name: string, email: string) {
    const exist = await this.userModel.findOne({
      $or: [
        { name }, {
          email
        }]
    })

    return exist ? true : false

  }

  async renovateUser(id: string) {
    try {
      const user = await this.userModel.findById(id)
      if (!user) {
        throw new NotFoundException('user not found')
      }

      await this.userModel.updateOne({ _id: user.id }, { days_use: 10, active_service: true })
      this.startJob(user, user.id)
    } catch (err) {

      throw err
    }
  }
  async startJob(user: User, _id: string) {
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