import mongoose, { Schema } from 'mongoose';

// to define the shape of a Group, use Memberships
const MembershipSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    refs: 'User'
  },
  character: {
    type: Schema.Types.ObjectId,
    refs: 'Character'
  }
});

// this is just here to make sure User compiles
const GroupSchema = new Schema({
  membership: [MembershipSchema]
});

const UserSchema = new Schema({
  username: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  characters: [{
    type: Schema.Types.ObjectId,
    refs: 'Character'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    refs: 'User'
  }],
  groups: [GroupSchema]
});

const AuthPayloadSchema = new Schema({
  user: UserSchema,
  token: String
});

const User = mongoose.model('User', UserSchema);
const AuthPayload = mongoose.model('AuthPayload', AuthPayloadSchema);
module.exports = {
  AuthPayload: AuthPayload,
  User: User
}
