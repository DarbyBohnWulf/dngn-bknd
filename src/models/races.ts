interface Vision {
  type: string,
  distance: number
}

interface AbilityBonus {
  ability: string,
  amount: number
}

interface RacialSpell {
  name: string,
  level: number,
  rest: boolean | string,
  sca: string
}

interface Race {
  name: string,
  size: string,
  walkingSpeed: number,
  vision?: Array<Vision>,
  languages: Array<string>,
  abilityBonuses: Array<AbilityBonus>,
  skills?: Array<string>,
  weapons?: Array<string>,
  tools?: Array<string>,
  traits: Array<string>,
  spells?: Array<RacialSpell>
}


const races: Array<Race> = [
  {
    name: 'Elf',
    size: 'Medium',
    walkingSpeed: 30,
    vision: [
      { type: 'lowlight', distance: 60 },
      { type: 'darkvision', distance: 0 }
    ],
    languages: ['Common', 'Elvish'],
    abilityBonuses: [
      { ability: 'DEX', amount: 2 }
    ],
    skills: ['Perception'],
    traits: [
      'Keen Senses', 'Fey Ancestry', 'Trance', 
    ]
  },
  {
    name: 'Human',
    size: 'Medium',
    walkingSpeed: 30,
    languages: ['Common','Free'],
    abilityBonuses: [
      { ability: 'STR', amount: 1},
      { ability: 'DEX', amount: 1},
      { ability: 'CON', amount: 1},
      { ability: 'INT', amount: 1},
      { ability: 'WIS', amount: 1},
      { ability: 'CHA', amount: 1},
    ],
    traits: []
  },
  {
    name: 'Half-Elf',
    size: 'Medium',
    walkingSpeed: 30,
    vision: [
      { type: 'lowlight', distance: 60 },
      { type: 'darkvision', distance: 0 }
    ],
    languages: ['Common','Elvish', 'Free'],
    abilityBonuses: [
      { ability: 'CHA', amount: 2 },
      { ability: 'ANY', amount: 1 },
      { ability: 'ANY', amount: 1 }
    ],
    skills: ['Free', 'Free'],
    traits: ['Fey Ancestry']
  },
  {
    name: 'Dwarf',
    size: 'Medium',
    walkingSpeed: 25,
    vision: [
      { type: 'lowlight', distance: 60 },
      { type: 'darkvision', distance: 0 }
    ],
    languages: ['Common', 'Dwarvish'],
    abilityBonuses: [
      { ability: 'CON', amount: 2 }
    ],
    weapons: ['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer'],
    tools: ['artisan'],
    traits: ['Dwarven Resilience', 'Dwarven Combat Training', 'Stonecutting']
  },
  {
    name: 'Dragonborn',
    size: 'Small',
    walkingSpeed: 25,
    vision: [
      { type: 'lowlight', distance: 60 },
      { type: 'darkvision', distance: 0 }
    ],
    languages: ['Common', 'Gnomish'],
    abilityBonuses: [
      { ability: 'INT', amount: 2 }
    ],
    traits: [
      'Gnome Cunning'
    ]
  },
  {
    name: 'Halfling',
    size: 'Small',
    walkingSpeed: 25,
    abilityBonuses: [
      { ability: 'DEX', amount: 2 }
    ],
    languages: ['Common', 'Halfling'],
    traits: ['Lucky', 'Brave', 'Halfling Nimbleness']
  }
]