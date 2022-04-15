const miningItemDescription =
  'Only obtainable from `mine`, does absolutely nothing.';

const items = {
  pickaxe: {
    id: 'pickaxe',
    name: 'Mining Pickaxe',
    price: 5e4,
    description: 'Needed to use `bro mine`, which can give items & coins.',
    icon: '<:pickaxe2:860374469423005728>',
    type: 'Utility'
  },
  coin: {
    id: 'coin',
    name: 'Bro Coin',
    price: 5e6,
    description:
      'Gives 2.5 million bank space, can be used multiple times with `bro use coin 10` for example.',
    icon: '<a:broCoin:790146029755433010>',
    type: 'Upgrades'
  },
  calendar: {
    id: 'calendar',
    name: "December's Advent Calendar",
    price: 1e8,
    description:
      'This item will give you a reward for 25 days, one reward per day (meant to be similar to the 25 days of Christmas gifts).\n\nRewards include: items, coins and uno tokens, all on different days',
    icon: '📆',
    type: 'Special'
  },
  cocaine: {
    id: 'cocaine',
    name: 'Cocaine',
    price: 1500000,
    description:
      'Gives you a 20% multiplier for 30 minutes, 20% chance to die as well while using it.',
    icon: '<:cocaine:888644649340784651>',
    type: 'Upgrades'
  },
  unocard: {
    id: 'unocard',
    name: 'Uno Reverse Card',
    price: 4e8,
    description:
      'Reverse a full gamble, it removes your cooldown and gives you back the coins you lost for a second try!',
    icon: '<:unocard:864195524818108466>',
    type: 'Upgrades'
  },
  tacos: {
    id: 'tacos',
    name: 'Tacos',
    price: 1e4,
    description:
      'Day old tacos that you get from searching or buying, can be sold for coins or collected.',
    icon: '🌮',
    type: 'Collectable'
  },
  steroids: {
    id: 'steroids',
    name: 'Steroids',
    price: 2e6,
    description:
      'Gives you a +1 to your gamble roll (random # between 1-12) for 30 minutes.',
    icon: '💉',
    type: 'Upgrades'
  },
  leaf: {
    id: 'leaf',
    name: 'Four Leaf Clover',
    price: 1e6,
    description: 'Gives you much better luck while robbing, lasts 12 hours.',
    icon: '🍀',
    type: 'Upgrades'
  },
  life: {
    id: 'life',
    name: 'Life Saver',
    price: 5e4,
    description:
      'This will literally save you from dying :o only obtainable from `beg`/`search`.',
    icon: '<:broLife:811809602144174121>',
    type: 'Lifesaver'
  },
  tintinsfoot: {
    id: 'tintinsfoot',
    name: "tintin's foot",
    price: 1e8,
    description:
      'This is a collectible now (does nothing), enjoy <:sparkles_cyan:855528534788407306>.',
    icon: '🦶🏼',
    type: 'yes'
  },
  lotteryticket: {
    id: 'lotteryticket',
    name: 'Lottery Ticket',
    price: 1e8,
    description:
      'Gained from winning the hourly lottery, purely a collectable.',
    icon: '🎟️',
    type: 'Lottery'
  },
  coupon: {
    id: 'coupon',
    name: 'Coupon',
    price: 1e9,
    description:
      "Gained from winning the weekly lottery. It allows you to use your coins gained from winning the weekly lottery to buy items, these coins can't be shared to other users, it can **only** be used to buy items in the shop, or to be kept as a collectable. Gifting this item to another user will not give them a coupon balance, it will only give them the actual item and it will render your remaining balance unusable unless you get a coupon again.",
    icon: '🎫',
    type: 'Lottery'
  },
  rock: {
    id: 'rock',
    name: 'Rock',
    price: 25e6,
    description: 'Useless expensive rock.',
    icon: '🪨',
    type: 'Collectable'
  },
  potato: {
    id: 'potato',
    name: 'Useless Potato',
    price: 0,
    description: miningItemDescription,
    icon: '🥔',
    type: 'Findable'
  },
  berries: {
    id: 'berries',
    name: 'Poisonous Berries',
    price: 1e5,
    description: miningItemDescription,
    icon: '<:berries:860213666263597056>',
    type: 'Findable'
  },
  diamond: {
    id: 'diamond',
    name: 'Shiny Diamond',
    price: 1e8,
    description: `${miningItemDescription}.. for now.`,
    icon: '<:diamond:860213606272073741>',
    type: 'Findable'
  },
  stone: {
    id: 'stone',
    name: 'Old Stone',
    price: 25e4,
    description: `${miningItemDescription}.. for now.`,
    icon: '<:stone:860213533115154442>',
    type: 'Findable'
  },
  ironore: {
    id: 'ironore',
    name: 'Iron Ore',
    price: 25e4,
    description: `${miningItemDescription}.. for now.`,
    icon: '<:iron_ore:860213566510465024>',
    type: 'Findable'
  },
  stick: {
    id: 'stick',
    name: 'Wooden Stick',
    price: 5e4,
    description: miningItemDescription,
    icon: '<:stick:860213509195431936>',
    type: 'Findable'
  },
  fireworks: {
    id: 'fireworks',
    name: 'Fireworks',
    price: 1e8,
    description:
      'Only obtainable from `search` during January, collectable item.',
    icon: '🎆',
    type: 'Antique'
  },
  cupid: {
    id: 'cupid',
    name: 'Cupid',
    price: 1e8,
    description: 'Only obtainable from `search` during February.',
    icon: '💘',
    type: 'Antique'
  },
  leprechaun: {
    id: 'leprechaun',
    name: "Leprechaun's Pot of Gold",
    price: 1e8,
    description:
      'Only obtainable from `search` during March, has a special use.',
    icon: '<:leprechaun:816143337391390740>',
    type: 'Antique'
  },
  robber: {
    id: 'robber',
    name: "April Fool's Robber",
    price: 1e8,
    description:
      "Chooses 5 random people in a server, as long as their wallet is above 500k, it'll steal a random portion of their wallets (between 500k-4m), and give it to you. You also have a 15% chance to get caught by the police while trying to rob users in a server (and you pay a 10% of your wallet as a fine). Passive mode will prevent you from being stolen from.",
    icon: '<:aprilRobber:827967886042988544>',
    type: 'Antique'
  },
  // may is missing an item
  lootbox: {
    id: 'lootbox',
    name: "June's Lootbox",
    price: 1e8,
    description:
      'Found from `search` and `mine`, contains past special items (monthly exclusives) + 100k - 5m coins. 10% chance to get regular shop items instead.',
    icon: '🎁',
    type: 'Antique'
  },
  umbrella: {
    id: 'umbrella',
    name: "July's Umbrella",
    price: 1e8,
    description:
      "Found from `search` & `beg`, if used, you can't be robbed or heisted for 1 week, but you can still rob/heist others.",
    icon: '⛱️',
    type: 'Antique'
  },
  magicwand: {
    id: 'magicwand',
    name: "August's Magic Wand",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of August, collectable item.',
    icon: '🪄',
    type: 'Antique'
  },
  flower: {
    id: 'flower',
    name: "September's Flower",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of September. This allows you to bypass the 20m share cap and give up to **500m at once** if used!',
    icon: '🍁',
    type: 'Antique'
  },
  ghost: {
    id: 'ghost',
    name: 'Friendly Ghost',
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of October. This is a small friendly ghost that does your begging, searching for you and gives you the rewards!',
    icon: '👻',
    type: 'Antique'
  },
  miner: {
    id: 'miner',
    name: "November's Miner",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of November. This item will give you the equivalent loot of running ~50 `mine` commands (hence the name, miner)!',
    icon: '<a:miner:907463378920964127>',
    type: 'Antique'
  },
  santa: {
    id: 'santa',
    name: 'Santa',
    price: 1e8,
    description:
      'Only obtainable from `search` during the Christmas season, collectable item.',
    icon: '<:broSanta:820471812143579196>',
    type: 'Antique'
  },
  medal: {
    id: 'medal',
    name: 'Lottery Medal',
    price: 1e8,
    description:
      'A Medal obtained by only the best of the best who has won the most lotteries.',
    icon: '<:lottomedal:913738474627162132>',
    type: 'Lottery'
  },
  unotoken: {
    id: 'unotoken',
    name: 'Uno Token',
    price: 0,
    description:
      "A reward given by December's Advent Calendar, you can redeem **1** uno card with **4** uno tokens! `bro use token` to check if you can do this (there will be a confirmation).",
    icon: '🧩',
    type: 'Redeemable'
  },
  envelope: {
    id: 'envelope',
    name: "February's Red Envelope",
    price: 1e8,
    description:
      'Only obtainable from `search`/`beg`/`mine` during the month of {date}.',
    icon: '<:envelope:938487343092998214>',
    date: 'Feb 2022'
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
    }
  },
  communityribbon: {
    id: 'communityribbon',
    name: "Bro Community's Ribbon",
    price: 1e8,
    description:
      "A special collectable that can only be gained from certain special events/drops within command channels in **[Bro Community](https://discord.gg/bros)**.\n\n**Currently**, there's a 1% chance that a message with a button to click can spawn within active command channels (`exclusive` + `bro` category + `general-chat`). The first person to click the button gains 1 of this item.",
    icon: '🎗️',
    type: 'Event'
  },
  reaper: {
    id: 'reaper',
    name: "Felli's Reaper",
    price: 0,
    description:
      'A collectable that can only be gained from using the `beg` command. Chances of finding this item is 2%.',
    icon: '<:gruesome:909094476285349958>',
    type: 'Findable'
  },
  centralbow: {
    id: 'centralbow',
    name: "Bro Central's Bow",
    price: 1e8,
    description:
      "A special collectable that can only be gained from certain drops within command channels in **[Bro Central](https://discord.gg/Enn7YSsYQ4)**.\n\nCurrently, there's a 0.5% chance that a message with a button to click can spawn within active command channels (`bro category` + `general-chat`). The first person to click the button gains 1 of this item.",
    icon: '🎀',
    type: 'Event'
  }
} as const;

export default items;

export type itemNames = keyof typeof items;
