import mongoose, { Schema } from 'mongoose';
import { SpellSchema } from './spell';

const VisionSchema = new Schema({
  type: {
    type: String,
    enum: [
      'darkvision', 'lowlight', 'blindsight', 'truesight', 'tremorsense'
    ]
  },
  distance: Number
},
{
  _id: false
});

const AbilityBonusSchema = new Schema({
  ability: {
    type: String,
    enum: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'ANY']
  },
  amount: Number
},
{
  _id: false
});

const RaceSchema = new Schema({
  name: String,
  size: {
    type: String,
    enum: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']
  },
  walkingSpeed: Number,
  burrowSpeed: Number,
  climbSpeed: Number,
  flySpeed: Number,
  swimSpeed: Number,
  vision: [VisionSchema],
  languages: [String],
  abilityBonuses: [AbilityBonusSchema],
  skills: [String],
  traits: [String],
  description: String,
});

const CastingAbilitySchema = new Schema({
  able: Boolean,
  ability: String
}, { _id: false }); 

const ClassSchema = new Schema({
  name: String,
  subclass: String,
  hitDie: {
    type: Number,
    enum: [6, 8, 10, 12]
  },
  armor: [String],
  weapon: [String],
  tool: [String],
  saves: [String],
  skillSelection: [String],
  numberOfSkills: Number,
  spellcasting: CastingAbilitySchema,
  startingEquipment: {},
  traits: [String],
  description: String,
});


const CharacterSchema = new Schema({
  name: String,
  race: RaceSchema,
  class: ClassSchema,
  abilities: {
    type: Map,
    of: Number
  },
  alignment: {
    type: Map,
    of: String
  },
  spellbook: [SpellSchema],
  proficiencies: [String],
  feats: [String],
  religion: String
});

export const Race = mongoose.model('Race', RaceSchema);
export const Class = mongoose.model('Class', ClassSchema);
export const Character = mongoose.model('Character', CharacterSchema);


