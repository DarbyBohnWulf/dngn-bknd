import mongoose, { Schema } from 'mongoose';

// this will be the base schema that gets hated and discriminated against
const ItemSchema = new Schema({
  name: String,
  weight: Number,
  rarity: {
    type: String,
    default: 'common'
  },
  material: {
    type: String,
    default: 'usual'
  },
  description: String,
  specialEffects: [String],
  type: String,
  price: Number
});

const ArmorSchema = new Schema({
  armorCat: String,
  armorClass: Number,
  armorBonus: Number,
  stealthDisadvantage: {
    type: Boolean,
    default: false
  }
});

const RollSchema = new Schema({
  amount: Number,
  sides: Number
});

const WeaponSchema = new Schema({
  weaponType: String,
  damageType: [{
    type: String,
    default: 'bludgeoning'
  }],
  damageRoll: RollSchema,
  damageBonus: Number,
  properties: [String],
  rangeNormal: Number,
  rangeLong: Number,
  simple: Boolean
});

ItemSchema.set('discriminatorKey', 'kind')

export const Item = mongoose.model('Item', ItemSchema);
export const Armor = Item.discriminator('Armor', ArmorSchema);
export const Weapon = Item.discriminator('Weapon', WeaponSchema)
