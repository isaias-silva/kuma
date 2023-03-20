import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
 
  name: {type:String, require:true},
  email: {type:String, require:true},
  password: {type:String, require:true},
  apiKey: {type:String, require:false},
  profile: {type:String, require:false},
  adm: {type:Boolean, require:true}
});

export interface User {

  name: String,
  email: String,
  password: String,
  apiKey: String,
  profile: Buffer,
  adm: Boolean
}