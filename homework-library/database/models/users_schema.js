import { Schema, model } from 'mongoose';

const usersSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UsersDB = model('UsersDB', usersSchema);

export default UsersDB;
