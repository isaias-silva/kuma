import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({

  name: { type: String, require: true },
  password: { type: String, require: true },
  apiKey: { type: String, require: false },
  adm: { type: Boolean, require: true },
  days_use: { type: Number },
  active_service: { type: Boolean },
});

export interface User {

  name: string,
  password: string,
  confirmPassword?: string
  apiKey?: string,
  adm: Boolean
  days_use?: number
  active_service?: boolean
}