
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from './user.model';

import { hash } from 'bcrypt'

@Injectable()
export class UserServices {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
  }

  async create(doc: User) {
    try {
      const existingUser = await this.checkUserWithEmailOrName(doc.email, doc.name);

      if (existingUser) {
        const error = new Error('Email or userName exists');
        error.name = 'ConflictError';
        throw error;
      }

      //
      const formattedUser = { ...doc };
      const salt = 10;
      formattedUser.password = await hash(formattedUser.password, salt);

      const result = await new this.userModel(formattedUser).save();
      return result._id;
    } catch (err) {
      //
      if (err.name === 'ConflictError') {
        throw new HttpException(err.message, HttpStatus.CONFLICT);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
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
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string) {
    try {
      const result = await this.userModel.deleteOne({ _id: id })
      return result
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserByEmail(email: string) {
  
    const exist = await this.userModel.findOne({ email })
    if (!exist) {
      return
    }

    return exist
  }
  async checkUserWithEmailOrName(email: string, name: string) {
    const exist = await this.userModel.findOne({
      $or: [
        { email },
        { name }]
    })
    console.log(exist)
    return exist ? true : false

  }
}