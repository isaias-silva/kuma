
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken'
import { Model } from 'mongoose';
import { User } from './user.model';
import { hash } from 'bcrypt'
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UserServices {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
  }

  async allusers() {
    const allUsers = await this.userModel.find({})
    const result = allUsers.map((user) => {
      const { name, id, apiKey, adm } = user
      const formatUser = { name, id, apiKey, adm }

      return formatUser
    })
    return result
  }

  async create(doc: User) {
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
      return result._id
    } catch (err) {

      if (err.name === 'ConflictError') {
        throw new HttpException(err.message, HttpStatus.CONFLICT);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  }

  async update(id: string, updateUser: UpdateUserDto) {
    try {
      const exist = await this.userModel.findOne({ name: updateUser.name })
      if (exist) {
        throw new HttpException('user name exists', 409)
      }
      await this.userModel.updateOne({ _id: id }, updateUser)

      const { _id, name, adm, apiKey, } = await this.userModel.findById(id)
      const token = jwt.sign({ _id, name, adm }, process.env.SECRET)
      return token
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
}