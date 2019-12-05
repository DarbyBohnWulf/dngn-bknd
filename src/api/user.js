import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import { schemaComposer, Mutation } from 'graphql-compose';
import bcrypt from 'bcrypt';
import * as fetch from 'node-fetch';
import { User, AuthPayload } from '../models/user';

const saltRounds = 10; // for bcrypt hashing

// here is where GQL will get its schema
const UserTC = composeWithMongoose(User);
// and here is where we'll define a type to use in auth
const AuthPayloadTC = composeWithMongoose(AuthPayload);

// this wrapper will handle password hashing for new users
UserTC.wrapResolverResolve('createOne', next => async rp => {
  rp.beforeRecordMutate = async (doc, resolveParams) => {
    doc.password = await bcrypt.hash(doc.password, saltRounds)
    return doc
  }
  return next(rp);
});

// here is where we compose all the resolvers
schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userMany: UserTC.getResolver('findMany')
});

// this is a custom resolver for login
UserTC.addResolver({
  name: 'login',
  args: { user_id: 'String!', password: 'String!' },
  type: AuthPayloadTC,
  description: "a login function",
  kind: Mutation,
  resolve: async (rp) => {
    try {
      const user = await User.findById(rp.args.user_id);
      console.log("this user\n", user);
      const match = await bcrypt.compare(rp.args.password, user.password);
      console.log("this match\n", match);
      if (match) {
        return { user, token: "SUCCESS" }
      } else {
        return { user, token: "FAILURE" }
      }
    } catch (err) {
      console.error("Login went WRONG\n",err);
      return { user: {username: "fake"}, token: "FAILURE" }
    }
  }
})

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver('createOne'),
  userLogin: UserTC.getResolver('login')
});

const gqlUser = schemaComposer.buildSchema();
export default gqlUser
