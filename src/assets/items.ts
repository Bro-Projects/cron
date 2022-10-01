const miningItemDescription =
  'Only obtainable from `mine`, does absolutely nothing.';
const swordItemDescription = 'Needed to forge a sword with `/sword forge`';

export enum itemTypes {
  Utility,
  Upgrades,
  Collectable,
  yes,
  Useless,
  // Non-buyable
  Lifesaver,
  Findable,
  // Non-sellable
  Lottery,
  Redeemable,
  Antique,
  Event,
  Special,
  Exclusive,
  Extras
}

const items = {
  pickaxe: {
    id: 'pickaxe',
    name: 'Mining Pickaxe',
    price: 5e4,
    description: 'This is needed to use `/mine`, which can give items & coins.',
    icon: '<:pickaxe2:860374469423005728>',
    type: itemTypes.Utility
  },
  coin: {
    id: 'coin',
    name: 'Bro Coin',
    price: 5e6,
    description:
      'Gives 2 million bank space, can be used multiple times with `/use coin amount:10` for example.',
    icon: '<a:broCoin:790146029755433010>',
    type: itemTypes.Upgrades
  },
  cocaine: {
    id: 'cocaine',
    name: 'Cocaine',
    price: 1500000,
    description:
      'Gives you a 20% multiplier for 30 minutes, 20% chance to die as well while using it.',
    icon: '<:cocaine:888644649340784651>',
    type: itemTypes.Upgrades
  },
  unocard: {
    id: 'unocard',
    name: 'Uno Reverse Card',
    price: 4e8,
    description:
      'Reverse a full gamble, it gives you back the coins you lost for a second try!',
    icon: '<:unocard:864195524818108466>',
    type: itemTypes.Upgrades
  },
  tacos: {
    id: 'tacos',
    name: 'Tacos',
    price: 1e4,
    description:
      'Day old tacos that you get from searching or buying, can be sold for coins or collected.',
    icon: '🌮',
    type: itemTypes.Collectable
  },
  steroids: {
    id: 'steroids',
    name: 'Steroids',
    price: 2e6,
    description:
      'Gives you a +1 to your gamble roll (random # between 1-12) for 30 minutes.',
    icon: '💉',
    type: itemTypes.Upgrades
  },
  leaf: {
    id: 'leaf',
    name: 'Four Leaf Clover',
    price: 1e6,
    description: 'Gives you much better luck while robbing, lasts 12 hours.',
    icon: '🍀',
    type: itemTypes.Upgrades
  },
  life: {
    id: 'life',
    name: 'Life Saver',
    price: 5e4,
    description:
      'This will literally save you from dying :o only obtainable from `beg`/`search`.',
    icon: '<:broLife:811809602144174121>',
    type: itemTypes.Lifesaver
  },
  tintinsfoot: {
    id: 'tintinsfoot',
    name: "tintin's foot",
    price: 1e8,
    description:
      'This is a collectible now (does nothing), enjoy <:sparkles_cyan:855528534788407306>.',
    icon: '🦶🏼',
    type: itemTypes.yes
  },
  lotteryticket: {
    id: 'lotteryticket',
    name: 'Lottery Ticket',
    price: 1e8,
    description:
      'Gained from winning the hourly lottery, purely a collectable.',
    icon: '🎟️',
    type: itemTypes.Lottery
  },
  coupon: {
    id: 'coupon',
    name: 'Coupon',
    price: 1e9,
    description:
      "Gained from winning the weekly lottery. It allows you to use your coins gained from winning the weekly lottery to buy items, these coins can't be shared to other users, it can **only** be used to buy items in the shop, or to be kept as a collectable. Gifting this item to another user will not give them a coupon balance, it will only give them the actual item and it will render your remaining balance unusable unless you get a coupon again.",
    icon: '🎫',
    type: itemTypes.Lottery
  },
  rock: {
    id: 'rock',
    name: 'Rock',
    price: 25e6,
    description: 'Useless expensive rock.',
    icon: '🪨',
    type: itemTypes.Collectable
  },
  potato: {
    id: 'potato',
    name: 'Useless Potato',
    price: 0,
    description: miningItemDescription,
    icon: '🥔',
    type: itemTypes.Findable
  },
  berries: {
    id: 'berries',
    name: 'Poisonous Berries',
    price: 1e5,
    description: miningItemDescription,
    icon: '<:berries:860213666263597056>',
    type: itemTypes.Findable
  },
  diamond: {
    id: 'diamond',
    name: 'Shiny Diamond',
    price: 1e8,
    description: `${miningItemDescription}.. for now.`,
    icon: '<:diamond:860213606272073741>',
    type: itemTypes.Findable
  },
  stone: {
    id: 'stone',
    name: 'Old Stone',
    price: 25e4,
    description: `${miningItemDescription}.. for now.`,
    icon: '<:stone:860213533115154442>',
    type: itemTypes.Findable
  },
  ironore: {
    id: 'ironore',
    name: 'Iron Ore',
    price: 25e4,
    description: `${miningItemDescription}.. for now.`,
    icon: '<:iron_ore:860213566510465024>',
    type: itemTypes.Findable
  },
  stick: {
    id: 'stick',
    name: 'Wooden Stick',
    price: 5e4,
    description: miningItemDescription,
    icon: '<:stick:860213509195431936>',
    type: itemTypes.Findable
  },

  medal: {
    id: 'medal',
    name: 'Lottery Medal',
    price: 1e8,
    description:
      'A Medal obtained by only the best of the best who has won the most lotteries.',
    icon: '<:lottomedal:913738474627162132>',
    type: itemTypes.Lottery
  },
  unotoken: {
    id: 'unotoken',
    name: 'Uno Token',
    price: 0,
    description:
      "A reward given by December's Advent Calendar, you can redeem **1** uno card with **4** uno tokens! `/use unotoken` to check if you can do this (there will be a confirmation).",
    icon: '🧩',
    type: itemTypes.Redeemable
  },

  shards: {
    id: 'shards',
    name: 'Shards',
    price: 0,
    description: swordItemDescription,
    icon: '<:shards:926397601266409482>',
    type: itemTypes.Extras
  },
  hilt: {
    id: 'hilt',
    name: 'Sword Hilt',
    price: 0,
    description: swordItemDescription,
    icon: '<:hilt:926439133008789504>',
    type: itemTypes.Extras
  },
  blade: {
    id: 'blade',
    name: 'Sword Blade',
    price: 0,
    description: swordItemDescription,
    icon: '<:blade:926440059169832970>',
    type: itemTypes.Extras
  },
  tip: {
    id: 'tip',
    name: 'Sword Tip',
    price: 0,
    description: swordItemDescription,
    icon: '<:tip:926440819718774785>',
    type: itemTypes.Extras
  },
  communityribbon: {
    id: 'communityribbon',
    name: "Bro Community's Ribbon",
    price: 1e8,
    description:
      "A special collectable that can only be gained from certain special events/drops within command channels in **[Bro Community](https://discord.gg/ZV6syzJmQD)**.\n\n**Currently**, there's a 0.5% chance that a message with a button to click can spawn within active command channels (`exclusive` + `bro` category + `general-chat`). The first person to click the button gains 1 of this item.",
    icon: '🎗️',
    type: itemTypes.Event
  },
  centralbow: {
    id: 'centralbow',
    name: "Bro Central's Bow",
    price: 0,
    description:
      "A special collectable that was only gained from certain event drops within command channels in **[Bro Central](https://discord.gg/Enn7YSsYQ4)**. It isn't attainable anymore.",
    icon: '🎀',
    type: itemTypes.Antique
  },
  reaper: {
    id: 'reaper',
    name: "Felli's Reaper",
    price: 0,
    description:
      'A collectable that can only be gained from using the `/beg` command. Chances of finding this item is 2%.',
    icon: '<:gruesome:909094476285349958>',
    type: itemTypes.Findable
  },
  bugcatcher: {
    id: 'bugcatcher',
    name: 'Bug Catcher',
    price: 0,
    description:
      "A collectable that can only be gained from finding major bugs within the bot and reporting it, this item cannot be traded or gifted to other users. It's exclusively for bug hunters.",
    icon: '<:bugHunter:1017243925045596252>',
    type: itemTypes.Exclusive
  },
  santa: {
    id: 'santa',
    name: 'Santa',
    price: 1e8,
    description:
      'Only obtainable from `search` during the Christmas season [{date}], collectable item.',
    icon: '<:broSanta:820471812143579196>',
    date: 'Dec 2020',
    type: itemTypes.Antique
  },
  fireworks: {
    id: 'fireworks',
    name: 'Fireworks',
    price: 1e8,
    description:
      'Only obtainable from `search` during {date}, collectable item.',
    icon: '🎆',
    date: 'Jan 2021',
    type: itemTypes.Antique
  },
  cupid: {
    id: 'cupid',
    name: 'Cupid',
    price: 1e8,
    description: 'Only obtainable from `search` during {date}.',
    icon: '💘',
    date: 'Feb 2021',
    type: itemTypes.Antique
  },
  leprechaun: {
    id: 'leprechaun',
    name: "Leprechaun's Pot of Gold",
    price: 1e8,
    description:
      'Only obtainable from `search` during {date}, has a special use.',
    icon: '<:leprechaun:816143337391390740>',
    date: 'March 2021',
    type: itemTypes.Antique
  },
  robber: {
    id: 'robber',
    name: "April Fool's Robber",
    price: 1e8,
    description:
      "Chooses 5 random people in a server, as long as their wallet is above 500k, it'll steal a random portion of their wallets (between 500k-4m), and give it to you. You also have a 15% chance to get caught by the police while trying to rob users in a server (and you pay a 10% of your wallet as a fine). Passive mode will prevent you from being stolen from.",
    icon: '<:aprilRobber:827967886042988544>',
    date: 'April 2021',
    type: itemTypes.Antique
  },
  // may gone
  lootbox: {
    id: 'lootbox',
    name: "June's Lootbox",
    price: 1e8,
    description:
      'Found from `search` and `mine`, contains past special items (monthly exclusives) + 100k - 5m coins. 10% chance to get regular shop items instead.',
    icon: '🎁',
    date: 'June 2021',
    type: itemTypes.Antique
  },
  umbrella: {
    id: 'umbrella',
    name: "July's Umbrella",
    price: 1e8,
    description:
      "Found from `search` & `beg`, if used, you can't be robbed or heisted for 1 week, but you can still rob/heist others.",
    icon: '⛱️',
    date: 'July 2021',
    type: itemTypes.Antique
  },
  magicwand: {
    id: 'magicwand',
    name: "August's Magic Wand",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of {date}, collectable item.',
    icon: '🪄',
    date: 'Aug 2021',
    type: itemTypes.Antique
  },
  flower: {
    id: 'flower',
    name: "September's Flower",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of {date}. This allows you to bypass the 20m share cap and give up to **500m at once** if used!',
    icon: '🍁',
    date: 'Sept 2021',
    type: itemTypes.Antique
  },
  ghost: {
    id: 'ghost',
    name: 'Friendly Ghost',
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of {date}. This is a small friendly ghost that does your begging, searching for you and gives you the rewards!',
    icon: '👻',
    date: 'Oct 2021',
    type: itemTypes.Antique
  },
  miner: {
    id: 'miner',
    name: "November's Miner",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of {date}. This item will give you the equivalent loot of running ~50 `mine` commands (hence the name, miner)!',
    icon: '<a:miner:907463378920964127>',
    date: 'Nov 2021',
    type: itemTypes.Antique
  },
  calendar: {
    id: 'calendar',
    name: "December's Advent Calendar",
    price: 1e8,
    description:
      'This item will give you a reward for 25 days, one reward per day (meant to be similar to the 25 days of Christmas gifts).\n\nRewards include: items, coins and uno tokens, all on different days',
    icon: '📆',
    date: 'Dec 2021',
    type: itemTypes.Antique
  },
  envelope: {
    id: 'envelope',
    name: "February's Red Envelope",
    price: 1e8,
    description:
      'Signifying the Lunar New Year starting on February 1st, it is only obtainable from `search`/`beg`/`mine` during the month of {date}. This item works like a coupon and you can use 8 of them to claim your rewards. You get 15 million coins to spend in the shop for each envelope used (you use 8 at a time, so 120m to spend in the shop) and you can use it with `/use envelope` to purchase shop items.',
    icon: '<:envelope:938487343092998214>',
    date: 'Feb 2022',
    type: itemTypes.Antique
  },
  colourpalette: {
    id: 'colourpalette',
    name: "March's Colour Palette",
    price: 1e8,
    description:
      'This is a collectable item that represents **Holi**. Holi is a Hindu festival that celebrates spring, love, and new life in March. Some families hold religious ceremonies, but for many Holi is more a time for fun.',
    icon: '🎨',
    date: 'March 2022',
    chances: {
      beg: 0.3,
      search: 0.3,
      mine: 0.3
    },
    endedEarly: true,
    type: itemTypes.Antique
  },
  easterbasket: {
    id: 'easterbasket',
    name: "April's Easter Basket",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of {date}. This is a collectible but may have a use in the future.',
    icon: '🧺',
    date: 'April 2022',
    chances: {
      beg: 1.5,
      search: 1.5,
      mine: 1.5
    },
    type: itemTypes.Antique
  },
  pinata: {
    id: 'pinata',
    name: "May's Piñata",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of {date}. This is a collectible related to Cinco de Mayo.',
    icon: '🪅',
    date: 'May 2022',
    chances: {
      beg: 1.5,
      search: 1.5,
      mine: 1.5
    },
    type: itemTypes.Antique
  },
  tree: {
    id: 'tree',
    name: "June's Tree",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of {date}. This is a collectible in honour of World Environment Day which occured on 5th June this year.',
    icon: '🌲',
    date: 'June 2022',
    chances: {
      beg: 1.5,
      search: 1.5,
      mine: 1.5
    },
    type: itemTypes.Antique
  },
  tropicalpunch: {
    id: 'tropicalpunch',
    name: "July & August's Tropical Punch",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the months of **July & August**. You can use this item for a 3-5% randomized luck boost that helps in the `beg`/`search`/`mine` commands.',
    icon: '🍹',
    date: 'July 2022',
    chances: {
      beg: 0.3,
      search: 0.3,
      mine: 0.3
    },
    type: itemTypes.Antique
  },
  slash: {
    id: 'slash',
    name: "September's Slash",
    price: 1e8,
    description:
      "To celebrate Discord's major change with bots (the switch to slash commands on the majority of bots), we've decided to make an item to honour that.",
    icon: '<:slash:1017243686016401608> ',
    date: 'September 2022',
    chances: {
      beg: 0.3,
      search: 0.3,
      mine: 0.3
    },
    type: itemTypes.Antique
  },
   diya: {
      id: 'diya',
      name: "October's Diya",
      price: 1e8,
      description: "In celebration of the festival of lights, diwali! This item will be available in the month of {date}.",
      date: 'October 2022',
      icon: "<:diya:1025794447935537276>",
      chances: {
        beg: 0.3,
        search: 0.3,
        mine: 0.3
      },
      type: itemTypes.Special 
   }
} as const;

export default items;

export type itemNames = keyof typeof items;
