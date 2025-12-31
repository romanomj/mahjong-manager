export const scoringData = [
  // 1. Basic / Standard Hands (Lowest to Highest)
  {
    "category": "Basic / 鸡胡",
    "name_en": "Chicken Hand",
    "name_zh": "鸡胡",
    "pinyin": "jī hú",
    "jyutping": "gai1 wu2",
    "faan": 0,
    "probability": "~20%",
    "description": "A hand with no scoring patterns. (Only possible if minimum faan is 0)",
    "image": "chicken_hand.png",
    "example_tiles": [
      "1_circles.png", "2_circles.png", "3_circles.png",
      "4_man.png", "5_man.png", "6_man.png",
      "8_circles.png", "8_circles.png", "8_circles.png",
      "7_sticks.png", "8_sticks.png", "9_sticks.png",
      "5_circles.png", "5_circles.png"
    ]
  },
  {
    "category": "Common / 平胡",
    "name_en": "Common Hand / All Chows",
    "name_zh": "平胡",
    "pinyin": "píng hú",
    "jyutping": "ping4 wu2",
    "faan": 1,
    "probability": "~7% (1 in 14)",
    "description": "All sets are Chows (sequences), no Pungs/Kongs. Pair is not dragons or seat/round wind.",
    "image": "common_hand.png",
    "example_tiles": [
      "6_circles.png", "7_circles.png", "8_circles.png",
      "2_man.png", "3_man.png", "4_man.png",
      "1_circles.png", "2_circles.png", "3_circles.png",
      "7_sticks.png", "8_sticks.png", "9_sticks.png",
      "6_man.png", "6_man.png"
    ]
  },
  {
    "category": "Triplets / 刻子",
    "name_en": "All Pungs",
    "name_zh": "对对胡",
    "pinyin": "duì duì hú",
    "jyutping": "deoi3 deoi3 wu2",
    "faan": 3,
    "probability": "~3.5% (1 in 28)",
    "description": "Hand composed of 4 Pungs/Kongs and 1 Pair.",
    "image": "all_pungs.png",
    "example_tiles": [
      "1_circles.png", "1_circles.png", "1_circles.png",
      "9_man.png", "9_man.png", "9_man.png",
      "5_sticks.png", "5_sticks.png", "5_sticks.png",
      "2_circles.png", "2_circles.png", "2_circles.png",
      "green_dragon.png", "green_dragon.png"
    ]
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "Mixed One Suit",
    "name_zh": "混一色",
    "pinyin": "hùn yī sè",
    "jyutping": "wan6 jat1 sik1",
    "faan": 3,
    "probability": "~6% (1 in 16)",
    "description": "Hand composed of one suit and honor tiles.",
    "image": "mixed_one_suit.png",
    "example_tiles": [
      "1_circles.png", "2_circles.png", "3_circles.png",
      "2_circles.png", "3_circles.png", "4_circles.png",
      "5_circles.png", "6_circles.png", "7_circles.png",
      "east.png", "east.png", "east.png",
      "4_circles.png", "4_circles.png"
    ]
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "All One Suit",
    "name_zh": "清一色",
    "pinyin": "qīng yī sè",
    "jyutping": "cing1 jat1 sik1",
    "faan": 7,
    "probability": "~3% (1 in 32)",
    "description": "Hand composed entirely of one suit (no honor tiles).",
    "image": "all_one_suit.png",
    "example_tiles": [
      "1_circles.png", "2_circles.png", "3_circles.png",
      "2_circles.png", "3_circles.png", "4_circles.png",
      "5_circles.png", "6_circles.png", "7_circles.png",
      "8_circles.png", "8_circles.png", "8_circles.png",
      "4_circles.png", "4_circles.png"
    ]
  },

  // 2. Dragons
  {
    "category": "Honor / 番子",
    "name_en": "Dragon Pung",
    "name_zh": "番子 (中/发/白)",
    "pinyin": "fān zǐ",
    "jyutping": "faan1 zi2",
    "faan": 1,
    "probability": "10-20%",
    "description": "Pung or Kong of Red, Green, or White Dragons. (1 faan each)",
    "image": "dragon_pung.png",
    "example_tiles": [
      "red_dragon.png", "red_dragon.png", "red_dragon.png"
    ]
  },
  {
    "category": "Honor / 番子",
    "name_en": "Small Three Dragons",
    "name_zh": "小三元",
    "pinyin": "xiǎo sān yuán",
    "jyutping": "siu2 saam1 jyun4",
    "faan": 5,
    "probability": "~0.15% (1 in 660)",
    "description": "Two Pungs/Kongs of dragons and a pair of the third dragon.",
    "image": "small_three_dragons.png",
    "example_tiles": [
      "red_dragon.png", "red_dragon.png", "red_dragon.png",
      "white_dragon.png", "white_dragon.png", "white_dragon.png",
      "6_circles.png", "7_circles.png", "8_circles.png",
      "8_man.png", "8_man.png", "8_man.png",
      "green_dragon.png", "green_dragon.png"
    ]
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "Jade Dragon",
    "name_zh": "翡翠龙",
    "pinyin": "fěi cuì lóng",
    "jyutping": "fei2 ceoi3 lung4",
    "faan": 6,
    "probability": "~0.1%",
    "description": "Hand that contains only pungs and/or kongs of Bamboo and Green Dragon Tiles.",
    "image": "jade_dragon.png",
    "example_tiles": [
      "1_sticks.png", "1_sticks.png", "1_sticks.png",
      "2_sticks.png", "2_sticks.png", "2_sticks.png",
      "4_sticks.png", "4_sticks.png", "4_sticks.png",
      "green_dragon.png", "green_dragon.png", "green_dragon.png",
      "7_sticks.png", "7_sticks.png"
    ]
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "Ruby Dragon",
    "name_zh": "红宝龙",
    "pinyin": "hóng bǎo lóng",
    "jyutping": "hung4 bou2 lung4",
    "faan": 6,
    "probability": "~0.1%",
    "description": "Hand that contains only pungs/kongs of Characters and the Red Dragon.",
    "image": "ruby_dragon.png",
    "example_tiles": [
      "red_dragon.png", "red_dragon.png", "red_dragon.png",
      "1_man.png", "1_man.png", "1_man.png",
      "3_man.png", "3_man.png", "3_man.png",
      "9_man.png", "9_man.png", "9_man.png",
      "6_man.png", "6_man.png"
    ]
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "Pearl Dragon",
    "name_zh": "珍珠龙",
    "pinyin": "zhēn zhū lóng",
    "jyutping": "zan1 zyu1 lung4",
    "faan": 6,
    "probability": "~0.1%",
    "description": "Hand that contains only pungs/kongs of Circles and the White Dragon.",
    "image": "pearl_dragon.png",
    "example_tiles": [
      "white_dragon.png", "white_dragon.png", "white_dragon.png",
      "2_circles.png", "2_circles.png", "2_circles.png",
      "5_circles.png", "5_circles.png", "5_circles.png",
      "8_circles.png", "8_circles.png", "8_circles.png",
      "4_circles.png", "4_circles.png"
    ]
  },
  {
    "category": "Honor / 番子",
    "name_en": "Big Three Dragons",
    "name_zh": "大三元",
    "pinyin": "dà sān yuán",
    "jyutping": "daai6 saam1 jyun4",
    "faan": 8,
    "probability": "~0.03% (1 in 3,744)",
    "description": "Three Pungs/Kongs of all three dragons.",
    "image": "big_three_dragons.png",
    "example_tiles": [
      "red_dragon.png", "red_dragon.png", "red_dragon.png",
      "green_dragon.png", "green_dragon.png", "green_dragon.png",
      "white_dragon.png", "white_dragon.png", "white_dragon.png",
      "5_sticks.png", "6_sticks.png", "7_sticks.png",
      "1_circles.png", "1_circles.png"
    ]
  },

  // 3. Winds
  {
    "category": "Honor / 番子",
    "name_en": "Seat/Round Wind",
    "name_zh": "圈风/门风",
    "pinyin": "quān fēng / mén fēng",
    "jyutping": "hyun1 fung1 / mun4 fung1",
    "faan": 1,
    "probability": "10-20%",
    "description": "Pung or Kong of the current Round Wind or your Seat Wind.",
    "image": "wind_pung.png"
  },
  {
    "category": "Honor / 番子",
    "name_en": "Small Four Winds",
    "name_zh": "小四喜",
    "pinyin": "xiǎo sì xǐ",
    "jyutping": "siu2 sei3 hei2",
    "faan": 10,
    "probability": "~0.01%",
    "description": "Three Pungs/Kongs of winds and a pair of the fourth wind.",
    "image": "small_four_winds.png",
    "example_tiles": [
      "east.png", "east.png", "east.png",
      "south.png", "south.png", "south.png",
      "west.png", "west.png", "west.png",
      "7_man.png", "8_man.png", "9_man.png",
      "north.png", "north.png"
    ]
  },
  {
    "category": "Honor / 番子",
    "name_en": "Big Four Winds",
    "name_zh": "大四喜",
    "pinyin": "dà sì xǐ",
    "jyutping": "daai6 sei3 hei2",
    "faan": 13,
    "probability": "~0.002% (1 in 57,856)",
    "description": "Four Pungs/Kongs of all four winds.",
    "image": "big_four_winds.png",
    "example_tiles": [
      "east.png", "east.png", "east.png",
      "south.png", "south.png", "south.png",
      "west.png", "west.png", "west.png",
      "north.png", "north.png", "north.png",
      "4_circles.png", "4_circles.png"
    ]
  },

  // 4. Terminals, Honors, Limit Hands
  {
    "category": "Suit Patterns / 色子",
    "name_en": "Mixed Terminals",
    "name_zh": "混老头",
    "pinyin": "hùn lǎo tóu",
    "jyutping": "wan6 lou5 tau4",
    "faan": 7,
    "probability": "~0.1%",
    "description": "A hand composed entirely of terminal tiles (1s and 9s) mixed with honor tiles (Winds/Dragons).",
    "image": "mixed_terminals.png",
    "example_tiles": [
      "1_man.png", "1_man.png", "1_man.png",
      "9_circles.png", "9_circles.png", "9_circles.png",
      "east.png", "east.png", "east.png",
      "red_dragon.png", "red_dragon.png", "red_dragon.png",
      "9_sticks.png", "9_sticks.png"
    ]
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "All Terminals",
    "name_zh": "清么九",
    "pinyin": "qīng lǎo tóu",
    "jyutping": "chinroutou",
    "faan": 13,
    "probability": "~0.004%",
    "description": "A hand composed entirely of terminal tiles (1s and 9s of any suit).",
    "image": "all_terminals.png",
    "example_tiles": [
      "1_sticks.png", "1_sticks.png", "1_sticks.png",
      "9_sticks.png", "9_sticks.png", "9_sticks.png",
      "1_circles.png", "1_circles.png", "1_circles.png",
      "1_man.png", "1_man.png", "1_man.png",
      "9_man.png", "9_man.png"
    ]
  },
  {
    "category": "Honor / 番子",
    "name_en": "All Honors",
    "name_zh": "字一色",
    "pinyin": "zì yī sè",
    "jyutping": "tsuuiisou",
    "faan": 13,
    "probability": "~0.01% (1 in 5,200)",
    "description": "A hand composed entirely of honor tiles (Winds and Dragons).",
    "image": "all_honors.png",
    "example_tiles": [
      "green_dragon.png", "green_dragon.png", "green_dragon.png",
      "red_dragon.png", "red_dragon.png", "red_dragon.png",
      "south.png", "south.png", "south.png",
      "west.png", "west.png", "west.png",
      "north.png", "north.png"
    ]
  },
  {
    "category": "Uncommon / 特殊",
    "name_en": "Thirteen Orphans",
    "name_zh": "十三幺",
    "pinyin": "shí sān yāo",
    "jyutping": "sap6 saam1 jiu1",
    "faan": 13,
    "probability": "~0.04% (1 in 2,464)",
    "description": "1 and 9 of each suit + all dragons and winds + 1 pair of any of them.",
    "image": "thirteen_orphans.png",
    "example_tiles": [
      "1_circles.png", "9_circles.png",
      "1_sticks.png", "9_sticks.png",
      "1_man.png", "9_man.png",
      "east.png", "south.png", "west.png", "north.png",
      "red_dragon.png", "green_dragon.png", "white_dragon.png"
    ]
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "Nine Gates",
    "name_zh": "九莲宝灯",
    "pinyin": "jiǔ lián bǎo dēng",
    "jyutping": "chuuren poutou",
    "faan": 13,
    "probability": "~0.0004%",
    "description": "A concealed hand of 1-1-1-2-3-4-5-6-7-8-9-9-9 in one suit, winning on any tile of that same suit.",
    "image": "nine_gates.png",
    "example_tiles": [
      "1_man.png", "1_man.png", "1_man.png",
      "2_man.png", "3_man.png", "4_man.png",
      "5_man.png", "6_man.png", "7_man.png",
      "8_man.png", "9_man.png", "9_man.png",
      "9_man.png"
    ]
  },
  {
    "category": "Special Hands / 特殊",
    "name_en": "Eighteen Arhats / Four Kongs",
    "name_zh": "十八罗汉",
    "pinyin": "shí bā luó hàn",
    "jyutping": "suukantsu",
    "faan": 13,
    "probability": "~0.0001%",
    "description": "A hand containing four Kongs (total of 18 tiles).",
    "image": "eighteen_arhats.png",
    "example_tiles": [
      "1_man.png", "1_man.png", "1_man.png", "1_man.png",
      "5_circles.png", "5_circles.png", "5_circles.png", "5_circles.png",
      "8_sticks.png", "8_sticks.png", "8_sticks.png", "8_sticks.png",
      "9_man.png", "9_man.png", "9_man.png", "9_man.png",
      "white_dragon.png", "white_dragon.png"
    ]
  },

  // 5. Flowers/Seasons (Incomplete Hand Points)
  {
    "category": "Flowers / Seasons / 花牌",
    "name_en": "No Flowers / Seasons",
    "name_zh": "无花",
    "pinyin": "wú huā",
    "jyutping": "nashi hana",
    "faan": 1,
    "probability": "~50% (Varies)",
    "description": "Winning without having any flower or season tiles.",
    "image": "no_flowers.png"
  },
  {
    "category": "Flowers / Seasons / 花牌",
    "name_en": "Own Flower / Season",
    "name_zh": "正花",
    "pinyin": "zhèng huā",
    "jyutping": "seihana",
    "faan": 1,
    "probability": "~25% (Per Tile)",
    "description": "Having a flower or season tile that matches your seat (1-East, 2-South, 3-West, 4-North).",
    "image": "own_flower.png"
  },
  {
    "category": "Flowers / Seasons / 花牌",
    "name_en": "Full Set of Flowers/Seasons",
    "name_zh": "一台",
    "pinyin": "yī tái",
    "jyutping": "ippai",
    "faan": 2,
    "probability": "~0.5%",
    "description": "Having all four flowers (1-4) or all four seasons (1-4). This is usually in addition to the 1 faan for 'Own Flower'.",
    "image": "full_set_flowers.png",
    "example_tiles": [
      "1_flowers.png", "2_flowers.png", "3_flowers.png", "4_flowers.png",
      "/",
      "1_season.png", "2_season.png", "3_season.png", "4_seasons.png"
    ]
  },
  {
    "category": "Flowers / Seasons / 花牌",
    "name_en": "All Eight Flowers & Seasons",
    "name_zh": "八仙过海",
    "pinyin": "bā xiān guò hǎi",
    "jyutping": "hachi sennin",
    "faan": 13,
    "probability": "~0.002%",
    "description": "Successfully collecting all eight flower and season tiles (Eight Immortals Crossing the Sea).",
    "image": "all_eight_flowers.png",
    "example_tiles": [
      "1_flowers.png", "2_flowers.png", "3_flowers.png", "4_flowers.png",
      "1_season.png", "2_season.png", "3_season.png", "4_seasons.png"
    ]
  },

  // 6. Bonuses / Conditionals
  {
    "category": "Special Hands / 特殊",
    "name_en": "Concealed Hand",
    "name_zh": "门前清",
    "pinyin": "mén qián qīng",
    "jyutping": "menzenchin",
    "faan": 1,
    "probability": "~10-15%",
    "description": "Winning with a hand that has no melds called from other players (must be a self-pick win).",
    "image": "concealed_hand.png"
  },
  {
    "category": "Triplets / 刻子",
    "name_en": "Two Concealed Kongs",
    "name_zh": "二暗杠",
    "pinyin": "èr àn gàng",
    "jyutping": "ji6 am3 gong3",
    "faan": 2,
    "probability": "~0.05%",
    "description": "Two concealed Kongs.",
    "image": "two_concealed_kongs.png"
  },
  {
    "category": "Triplets / 刻子",
    "name_en": "Three Concealed Pungs",
    "name_zh": "三暗刻",
    "pinyin": "sān àn kè",
    "jyutping": "sanankou",
    "faan": 2,
    "probability": "~0.3%",
    "description": "A hand containing three pungs or kongs that were drawn from the wall, not called from discards.",
    "image": "three_concealed_pungs.png"
  },
  {
    "category": "Triplets / 刻子",
    "name_en": "Four Concealed Pungs",
    "name_zh": "四暗刻",
    "pinyin": "sì àn kè",
    "jyutping": "suuankou",
    "faan": 13,
    "probability": "~0.03%",
    "description": "A hand composed of four pungs or kongs, all of which were drawn (concealed) rather than called.",
    "image": "four_concealed_pungs.png"
  },

  // 7. Winning Conditions
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Self-Pick / Tsumo",
    "name_zh": "自摸",
    "pinyin": "zì mō",
    "jyutping": "zi6 mo1",
    "faan": 1,
    "probability": "~30-40% of wins",
    "description": "Winning by drawing the tile yourself.",
    "image": "tsumo.png"
  },
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Robbing the Kong",
    "name_zh": "抢杠",
    "pinyin": "qiǎng gàng",
    "jyutping": "coeng2 gong3",
    "faan": 1,
    "probability": "~0.3% (1 in 320)",
    "description": "Winning off a tile that an opponent adds to a melded pung to form a kong.",
    "image": "robbing_kong.png"
  },
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Win on Last Tile / Moon",
    "name_zh": "海底捞月",
    "pinyin": "hǎi dǐ lāo yuè",
    "jyutping": "hoi2 dai2 laau4 jyut6",
    "faan": 1,
    "probability": "~0.5%",
    "description": "Winning by self-picking the very last tile of the wall.",
    "image": "moon.png"
  },
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Win on a Kong",
    "name_zh": "杠上开花",
    "pinyin": "gāng shàng kāi huā",
    "jyutping": "rinshan kaihou",
    "faan": 1,
    "probability": "~0.3%",
    "description": "Winning by drawing the replacement tile after declaring a Kong (Flower on a Kong).",
    "image": "win_on_kong.png"
  },
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Win on Last Discard",
    "name_zh": "河底捞鱼",
    "pinyin": "hé dǐ lāo yú",
    "jyutping": "houtei raoyui",
    "faan": 1,
    "probability": "~0.5%",
    "description": "Winning by calling the非常 last discard of the game (Catching the Fish from the Bottom).",
    "image": "win_last_discard.png"
  },
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Heavenly Hand / Win",
    "name_zh": "天胡",
    "pinyin": "tiān hú",
    "jyutping": "tenhou",
    "faan": 13,
    "probability": "~0.0003% (1 in 330k)",
    "description": "The dealer wins on their initial 14-tile hand.",
    "image": "heavenly_hand.png"
  },
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Earthly Hand / Win",
    "name_zh": "地胡",
    "pinyin": "dì hú",
    "jyutping": "chiihou",
    "faan": 13,
    "probability": "~0.0003% (1 in 330k)",
    "description": "A non-dealer wins on the dealer's very first discard.",
    "image": "earthly_hand.png"
  },
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Human Hand",
    "name_zh": "人胡",
    "pinyin": "rén hú",
    "jyutping": "jan4 wu4",
    "faan": 13,
    "probability": "~0.0005%",
    "description": "A non-dealer wins on a discard within the first go-around of the game (before their first turn).",
    "image": "human_hand.png"
  }
];
