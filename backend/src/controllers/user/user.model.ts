import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({

  name: { type: String, require: true },
  email: { type: String, require: false},
  password: { type: String, require: true },
  apiKey: { type: String, require: false },
  profile: { type: String, require: false },
  adm: { type: Boolean, require: true }
});

export interface User {

  name: string,
  email: string,
  password: string,
  confirmPassword?: string
  apiKey?: string,
  profile?: Buffer,
  adm: Boolean
}