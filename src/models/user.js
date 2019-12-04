import mongoose, { Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import { schemaComposer } from 'graphql-compose';
import { async } from 'regenerator-runtime';

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

const User = mongoose.model('User', UserSchema);

// here is where GQL will get its model
const UserTC = composeWithMongoose(User);

UserTC.wrapResolverResolve('createOne', next => async rp => {
  rp.beforeRecordMutate = async (doc, resolveParams) => {
    console.log('Hello?\n', resolveParams)
    return doc
  }
  return next(rp);
});

// UserTC.addResolver({
//   name: 'createOne',
//   args: {username: 'String', email: 'String!', password: 'String!'},
//   type: UserTC,
//   resolve: async ({source, args}) => {
//     const res = await fetch('http://localhost:3080/graphql');
//     const data = await res.json();

//   }
// })

// here is where we compose all the resolvers
schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userMany: UserTC.getResolver('findMany')
});

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver('createOne')
});

const gqlUser = schemaComposer.buildSchema();
export default gqlUser
