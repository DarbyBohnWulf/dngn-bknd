import mongoose, { Schema } from 'mongoose';

const TimeSchema = new Schema({
  amount: Number,
  unit: {
    type: String,
    enum: [
      'day', 'hour', 'minute', 'round', 'second', 'action', 'bonus_action',
      'reaction', 'instantaneous', 'until_dispelled', 'special'
    ],
    default: 'action'
  }
});

const AreaSchema = new Schema({
  amount: Number,
  casting: Number,
  effect: Number,
  shape: {
    type: String,
    enum: ['cube', 'cone', 'sphere', 'cylinder'],
    default: 'cylinder'
  }
});

const ComponentsSchema = new Schema({
  verbal: Boolean,
  somatic: Boolean,
  material: Boolean
},
{ _id: false });

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
  components: ComponentsSchema,
  castingTime: TimeSchema,
  duration: TimeSchema,
  ritual: Boolean,
  areaOfEffect: AreaSchema,
  target: {
    type: String,
    enum: ['other', 'self'],
    default: 'other'
  },
  range: Number,
  effects: [String],
  effectsAtHigherLevels: [String]
});

const Spell = mongoose.model('Spell', SpellSchema);

export default Spell;
