import mongoose, { Schema } from 'mongoose';

const TimeSchema = new Schema({
  length: Number,
  unit: {
    type: String,
    enum: [
      'day', 'hour', 'minute', 'round', 'second', 'action', 'bonus_action',
      'reaction', 'instantaneous'
    ],
    default: 'action'
  }
});

const AreaSchema = new Schema({
  amount: Number,
  unit: {
    type: String,
    enum: ['foot', 'square'],
    default: 'square'
  }
});

export const SpellSchema = new Schema({
  name: String,
  school: {
    type: String,
    enum: [
      'Evocation', 'Enchantment','Abjuration', 'Conjuration', 'Divination',
      'Illusion', 'Necromancy', 'Transmutation'
    ],
    required: true
  },
  level: Number,
  castingTime: TimeSchema,
  duration: TimeSchema,
  ritual: Boolean,
  areaOfEffect: AreaSchema,
  target: {
    type: String,
    enum: ['other', 'self'],
    default: 'other'
  },
  shape: {
    type: String,
    enum: ['cube', 'cone', 'sphere', 'cylinder'],
    default: 'cylinder'
  },
  size: Number,
  range: Number,
  effects: [String],
  effectsAtHigherLevels: [String]
});

const Spell = mongoose.model('Spell', SpellSchema);

export default Spell;
