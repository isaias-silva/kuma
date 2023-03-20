
import { HttpException, HttpStatus, Injectable, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from './user.model';


@Injectable()
export class UserServices {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
  }

  async create(doc: User) {
    try {
      const result = await new this.userModel(doc).save();
      return result
    } catch (err) {
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async findById(id: string) {
    try {

      const result = await this.userModel.findById(id)
      return result;
    } catch (err) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }



  async update(id: string, updateInfo: User) {
    try {
      const result = await this.userModel.updateOne({ _id: id }, updateInfo)
      return result

    } catch (err) {
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string) {
    try {

      const result = await this.userModel.deleteOne({ _id: id })
      return result
    } catch (err) {
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}