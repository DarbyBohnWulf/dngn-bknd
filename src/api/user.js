import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import { schemaComposer } from 'graphql-compose';
import bcrypt from 'bcrypt';
import User from '../models/user';

const saltRounds = 10; // for bcrypt hashing

// here is where GQL will get its model
const UserTC = composeWithMongoose(User);

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

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver('createOne')
});

const gqlUser = schemaComposer.buildSchema();
export default gqlUser
