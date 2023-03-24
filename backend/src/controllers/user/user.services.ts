
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken'
import { Model } from 'mongoose';
import { User } from './user.model';
import { hash } from 'bcrypt'
import { UpdateUserDto } from './update-user.dto';
import axios from 'axios';
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
      const { apiKey, adm, name, _id } = result
      const token = jwt.sign({ apiKey, adm, name, _id }, process.env.SECRET)
      return token
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
    const { name, _id, adm, apiKey } = exist

    return { name, _id, adm, apiKey }
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
 
      const test=  await axios.get(`https://api.telegram.org/bot${apiKey}/getMe`)
      

     console.log(test)
      if(test.status!=200){
  
        throw new HttpException('invalid api key', HttpStatus.BAD_REQUEST)
      }
      const exist = await this.userModel.findById(userId)
      if (!exist) {
        throw new HttpException('user not found', 404)
      }
      await this.userModel.updateOne({ _id: userId }, { apiKey })

      return
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
}