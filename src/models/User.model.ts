import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  _id: string
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: "string",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  Username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  Messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  Username: {
    type: "string",
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: "string",
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: "string",
    required: [true, "password is required"],
    unique: true,
  },
  verifyCode: {
    type: "string",
    required: [true, "verifyCode is required"],
    unique: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCodeExpiry is required"],
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  }, 
  Messages: [MessageSchema]
});

const UserModel = ( mongoose.models.User as mongoose.Model<User>  || mongoose.model('User' , UserSchema)) ;

export default UserModel;