import {
  Schema, model 
} from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
}, { timestamps: true })

const UserModel = model('UserModel', UserSchema)

export default UserModel