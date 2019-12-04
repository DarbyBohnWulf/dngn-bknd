import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import { schemaComposer } from 'graphql-compose';
import User from '../models/user';

// here is where GQL will get its model
const UserTC = composeWithMongoose(User);

// this wrapper will handle password hashing for new users
UserTC.wrapResolverResolve('createOne', next => async rp => {
  rp.beforeRecordMutate = async (doc, resolveParams) => {
    
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
