import { composeWithMongoose, composeWithMongooseDiscriminators } from 'graphql-compose-mongoose';
import { schemaComposer, Mutation } from 'graphql-compose';
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

// this wrapper will handle password hashing for new users
UserTC.wrapResolverResolve('createOne', next => async rp => {
  rp.beforeRecordMutate = async (doc, resolveParams) => {
    await bcrypt.hash(doc.password, saltRounds)
      .then(p => doc.password = p)
      .catch(console.error);
    return doc
  }
  return next(rp)
});

// use method with support for discriminators
const ItemDTC = composeWithMongooseDiscriminators(Item);
const ArmorTC = ItemDTC.discriminator(Armor);
const WeaponTC = ItemDTC.discriminator(Weapon);
const RaceTC = composeWithMongoose(Race);
const ClassTC = composeWithMongoose(Class);
const CharacterTC = composeWithMongoose(Character);
const SpellTC = composeWithMongoose(Spell);

// here is where we compose all the resolvers
schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
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
  characters: CharacterTC.getResolver('findMany')
});

// this is a custom resolver for login
UserTC.addResolver({
  name: 'login',
  args: { user_id: 'String!', password: 'String!' },
  type: AuthPayloadTC,
  description: "a login function",
  kind: Mutation,
  resolve: async (rp) => {
    let token = 'FAILURE';
    try {
      const user = await User.findById(rp.args.user_id);
      // console.log("this context\n", rp.context);
      // console.log("this user\n", user);
      const match = await bcrypt.compare(rp.args.password, user.password);
      // console.log("this match\n", match);
      if (match) {
        delete user.password
        const payload = {
          username: user.username,
          email: user.email,
          id: user._id
        };
        token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {expiresIn: '7d'}
        );
        
        return { user, token }
      } else {
        return { user, token }
      }
    } catch (err) {
      console.error("Login went WRONG\n",err);
      return { user: {username: "fake"}, token }
    }
  }
});

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver('createOne'),
  userLogin: UserTC.getResolver('login'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveMany: UserTC.getResolver('removeMany'),
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

