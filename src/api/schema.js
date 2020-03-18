import { composeWithMongoose, composeWithMongooseDiscriminators } from 'graphql-compose-mongoose';
import { schemaComposer, Mutation, Query } from 'graphql-compose';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, AuthPayload } from '../models/user';
import { Item, Weapon, Armor } from '../models/item';
import { Race, Class, Character } from '../models/character';
import Spell from '../models/spell';

const saltRounds = 10; // for bcrypt hashing

// here is where GQL will get its schema
const UserTC = composeWithMongoose(User);
// and here is where we'll define a type to use in auth
const AuthPayloadTC = composeWithMongoose(AuthPayload);
// use method with support for discriminators
const ItemDTC = composeWithMongooseDiscriminators(Item);
const ArmorTC = ItemDTC.discriminator(Armor);
const WeaponTC = ItemDTC.discriminator(Weapon);
const RaceTC = composeWithMongoose(Race);
const ClassTC = composeWithMongoose(Class);
const CharacterTC = composeWithMongoose(Character);
const SpellTC = composeWithMongoose(Spell);

// this relation helps find the a user's friends naturally
UserTC.addRelation(
  'friends',
  {
    resolver: () => UserTC.getResolver('findByIds'),
    prepareArgs: { // this is where you provide the args for this resolver
      _ids: source => source.friends,
    },
    projection: { friends: 1 }, 
  }
);

// this relation allows natural resolution of User's characters
UserTC.addRelation(
  'characters',
  {
    resolver: () => CharacterTC.getResolver('findByIds'),
    prepareArgs: {
      _ids: source => source.characters
    },
  }
);

// this relation is for retrieving info on a Character's race...
CharacterTC.addRelation(
  'race',
  {
    resolver: () => RaceTC.getResolver('findById'),
    prepareArgs: {
      _id: source => source.race
    },
  }
);

CharacterTC.addRelation(
  'class',
  {
    resolver: () => ClassTC.getResolver('findById'),
    prepareArgs: {
      _id: source => source.class
    },
  }
);

// // this relation is for groups
// UserTC.addRelation(
//   'groups',
//   {
//     resolver: () => UserTC.getResolver
//   }
// )

// a convenience resolver for info about yourself
UserTC.addResolver({
  name: 'me',
  type: UserTC,
  description: 'Get info about the currently logged in user.',
  kind: Query,
  resolve: async ({ context }) => {
    const user = User.findById(context.currentUser);
    return user
  }
})

// here is where we compose all the resolvers
schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  itemPick: ItemDTC.getResolver('findById'),
  itemList: ItemDTC.getResolver('findMany'),
  armorPick: ArmorTC.getResolver('findById'),
  armorList: ArmorTC.getResolver('findMany'),
  weaponPick: WeaponTC.getResolver('findById'),
  weaponList: WeaponTC.getResolver('findMany'),
  race: RaceTC.getResolver('findOne'),
  races: RaceTC.getResolver('findMany'),
  raceById: RaceTC.getResolver('findById'),
  class: ClassTC.getResolver('findOne'),
  classes: ClassTC.getResolver('findMany'),
  spell: SpellTC.getResolver('findOne'),
  spells: SpellTC.getResolver('findMany'),
  character: CharacterTC.getResolver('findOne'),
  characters: CharacterTC.getResolver('findMany'),
  me: UserTC.getResolver('me'),
});

// this is a better registration process
UserTC.addResolver({
  name: 'register',
  args: { username: 'String', email: 'String!', password: 'String!' },
  type: AuthPayloadTC,
  description: "a resolver to register new users",
  kind: Mutation,
  resolve: async ({ args }) => {
    args.email = args.email.toLowerCase();

    try {
      // check if someone's using provided email, and return early if so
      if (await User.exists({ email: args.email.toLowerCase() })){
        return { token: 'That email is taken.' };
      }
      await bcrypt.hash(args.password,saltRounds)
        .then( hp => args.password = hp);
      const user = await User.create(args);
      const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
      }
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return { user, token }
    } catch(err) {
      console.error("There was a problem during registration\n", err);
      return { token: 'Something went wrong.' }
    }
  }
});

// this is a custom resolver for login
UserTC.addResolver({
  name: 'login',
  args: { email: 'String!', password: 'String!' },
  type: AuthPayloadTC,
  description: "a login function",
  kind: Mutation,
  resolve: async ({ args, context }) => {
    let token = 'FAILURE';
    try {
      const users = await User.find({ email: args.email });
      if (users.length > 0) {
        const user  = users[0];
        const match = await bcrypt.compare(args.password, user.password);
        if (match) {
          delete user.password;
          const payload = {
            username: user.username,
            email: user.email,
            _id: user._id
          };
          token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
          );

          context.session.token = token;
          
          return { user, token }
        } else {
          return { user, token }
        }
      }
    } catch (err) {
      console.error("Login went WRONG\n",err);
      return { token }
    }
  }
});

// this resolver logs you out and destroys your session
UserTC.addResolver({
  name: 'logout',
  type: AuthPayloadTC,
  args: {},
  kind: Mutation,
  resolve: async ({ context }) => {
    try {
      // destroy session and token to logout
      context.session.destroy();
      // return a nullish AuthPayload
      return { user: { _id: '' }, token: '' }
    } catch(err) {
      console.error(err);
      return { user: { _id: '' }, token: '' }
    }
  }
});

// this resolver is for adding a friend
UserTC.addResolver({
  name: 'addFriend',
  type: UserTC,
  args: { userId: 'MongoID!', newFriend: 'MongoID!' },
  kind: Mutation,
  resolve: async ({ args }) => {
    const user = await User.updateOne(
      { _id: args.userId },
      { $push: { friends: args.newFriend } }
    );
    const newFriend = await User.findById(args.newFriend);
    if (!user || !newFriend) {
      return null // or gracefully return an error etc...
    } else {
      newFriend.friends.push(args.userId);
    }
    return User.findById(args.userId) // return the record
  }
});

// this resolver will save a character to a User's roster
UserTC.addResolver({
  name: 'addCharacter',
  type: UserTC,
  kind: Mutation,
  args: { userId: 'MongoID!', charId: 'MongoID!' },
  resolve: async ({ args }) => {
    const user = await User.updateOne(
      { _id: args.userId },
      { $push: { characters: args.charId } }
    );

    if (!user) return null // or return an error?

    return User.findById(args.userId)
  }
});

schemaComposer.Mutation.addFields({
  userRegister: UserTC.getResolver('register'),
  userLogin: UserTC.getResolver('login'),
  userLogout: UserTC.getResolver('logout'),
  addFriend: UserTC.getResolver('addFriend'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveMany: UserTC.getResolver('removeMany'),
  addCharacter: UserTC.getResolver('addCharacter'),
  itemAdd: ItemDTC.getResolver('createOne'),
  itemAddMany: ItemDTC.getResolver('createMany'),
  itemUpdate: ItemDTC.getResolver('updateOne'),
  itemUpdateMany: ItemDTC.getResolver('updateMany'),
  itemRemoveById: ItemDTC.getResolver('removeById'),
  itemRemoveMany: ItemDTC.getResolver('removeMany'),
  armorAdd: ArmorTC.getResolver('createOne'),
  armorAddMany: ArmorTC.getResolver('createMany'),
  armorUpdate: ArmorTC.getResolver('updateOne'),
  armorUpdateMany: ArmorTC.getResolver('updateMany'),
  armorRemoveById: ArmorTC.getResolver('removeById'),
  armorRemoveMany: ArmorTC.getResolver('removeMany'),
  weaponAdd: WeaponTC.getResolver('createOne'),
  weaponAddMany: WeaponTC.getResolver('createMany'),
  weaponUpdate: WeaponTC.getResolver('updateOne'),
  weaponUpdateMany: WeaponTC.getResolver('updateMany'),
  weaponRemoveById: WeaponTC.getResolver('removeById'),
  weaponRemoveMany: WeaponTC.getResolver('removeMany'),
  spellAdd: SpellTC.getResolver('createOne'),
  spellAddMany: SpellTC.getResolver('createMany'),
  spellUpdate: SpellTC.getResolver('updateOne'),
  spellUpdateMany: SpellTC.getResolver('updateMany'),
  spellRemoveById: SpellTC.getResolver('removeById'),
  spellRemoveMany: SpellTC.getResolver('removeMany'),
  classAdd: ClassTC.getResolver('createOne'),
  classAddMany: ClassTC.getResolver('createMany'),
  classUpdate: ClassTC.getResolver('updateOne'),
  classUpdateMany: ClassTC.getResolver('updateMany'),
  classRemoveById: ClassTC.getResolver('removeById'),
  classRemoveMany: ClassTC.getResolver('removeMany'),
  raceAdd: RaceTC.getResolver('createOne'),
  raceAddMany: RaceTC.getResolver('createMany'),
  raceUpdate: RaceTC.getResolver('updateOne'),
  raceUpdateMany: RaceTC.getResolver('updateMany'),
  raceRemoveById: RaceTC.getResolver('removeById'),
  raceRemoveMany: RaceTC.getResolver('removeMany'),
  characterAdd: CharacterTC.getResolver('createOne'),
  characterAddMany: CharacterTC.getResolver('createMany'),
  characterUpdate: CharacterTC.getResolver('updateOne'),
  characterUpdateMany: CharacterTC.getResolver('updateMany'),
  characterRemoveById: CharacterTC.getResolver('removeById'),
  characterRemoveMany: CharacterTC.getResolver('removeMany'),
});

// all the models come together to make one GraphQL schema
const gqlSchema = schemaComposer.buildSchema();
export default gqlSchema;

