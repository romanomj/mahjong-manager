export const scoringData = [
  {
    "category": "Basic / 鸡胡",
    "name_en": "Chicken Hand",
    "name_zh": "鸡胡",
    "pinyin": "jī hú",
    "jyutping": "gai1 wu2",
    "faan": 0,
    "description": "A hand with no scoring patterns. (Only possible if minimum faan is 0)",
    "image": "chicken_hand.png"
  },
  {
    "category": "Common / 平胡",
    "name_en": "Common Hand / All Chows",
    "name_zh": "平胡",
    "pinyin": "píng hú",
    "jyutping": "ping4 wu2",
    "faan": 1,
    "description": "All sets are Chows (sequences), no Pungs/Kongs. Pair is not dragons or seat/round wind.",
    "image": "common_hand.png"
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "Mixed One Suit",
    "name_zh": "混一色",
    "pinyin": "hùn yī sè",
    "jyutping": "wan6 jat1 sik1",
    "faan": 3,
    "description": "Hand composed of one suit and honor tiles.",
    "image": "mixed_one_suit.png"
  },
  {
    "category": "Suit Patterns / 色子",
    "name_en": "All One Suit",
    "name_zh": "清一色",
    "pinyin": "qīng yī sè",
    "jyutping": "cing1 jat1 sik1",
    "faan": 7,
    "description": "Hand composed entirely of one suit (no honor tiles).",
    "image": "all_one_suit.png"
  },
  {
    "category": "Triplets / 刻子",
    "name_en": "All Pungs",
    "name_zh": "对对胡",
    "pinyin": "duì duì hú",
    "jyutping": "deoi3 deoi3 wu2",
    "faan": 3,
    "description": "Hand composed of 4 Pungs/Kongs and 1 Pair.",
    "image": "all_pungs.png"
  },
  {
    "category": "Triplets / 刻子",
    "name_en": "Two Concealed Kongs",
    "name_zh": "二暗杠",
    "pinyin": "èr àn gàng",
    "jyutping": "ji6 am3 gong3",
    "faan": 2,
    "description": "Two concealed Kongs.",
    "image": "two_concealed_kongs.png"
  },
  {
    "category": "Honor / 番子",
    "name_en": "Dragon Pung",
    "name_zh": "番子 (中/发/白)",
    "pinyin": "fān zǐ",
    "jyutping": "faan1 zi2",
    "faan": 1,
    "description": "Pung or Kong of Red, Green, or White Dragons. (1 faan each)",
    "image": "dragon_pung.png"
  },
  {
    "category": "Honor / 番子",
    "name_en": "Seat/Round Wind",
    "name_zh": "圈风/门风",
    "pinyin": "quān fēng / mén fēng",
    "jyutping": "hyun1 fung1 / mun4 fung1",
    "faan": 1,
    "description": "Pung or Kong of the current Round Wind or your Seat Wind.",
    "image": "wind_pung.png"
  },
  {
    "category": "Honor / 番子",
    "name_en": "Small Three Dragons",
    "name_zh": "小三元",
    "pinyin": "xiǎo sān yuán",
    "jyutping": "siu2 saam1 jyun4",
    "faan": 5,
    "description": "Two Pungs/Kongs of dragons and a pair of the third dragon.",
    "image": "small_three_dragons.png"
  },
  {
    "category": "Honor / 番子",
    "name_en": "Big Three Dragons",
    "name_zh": "大三元",
    "pinyin": "dà sān yuán",
    "jyutping": "daai6 saam1 jyun4",
    "faan": 8,
    "description": "Three Pungs/Kongs of all three dragons.",
    "image": "big_three_dragons.png"
  },
  {
    "category": "Honor / 番子",
    "name_en": "Small Four Winds",
    "name_zh": "小四喜",
    "pinyin": "xiǎo sì xǐ",
    "jyutping": "siu2 sei3 hei2",
    "faan": 10, // Value varies, but often limit or near limit
    "description": "Three Pungs/Kongs of winds and a pair of the fourth wind.",
    "image": "small_four_winds.png"
  },
  {
    "category": "Honor / 番子",
    "name_en": "Big Four Winds",
    "name_zh": "大四喜",
    "pinyin": "dà sì xǐ",
    "jyutping": "daai6 sei3 hei2",
    "faan": 13, // Limit
    "description": "Four Pungs/Kongs of all four winds.",
    "image": "big_four_winds.png"
  },
  {
    "category": "Uncommon / 特殊",
    "name_en": "Thirteen Orphans",
    "name_zh": "十三幺",
    "pinyin": "shí sān yāo",
    "jyutping": "sap6 saam1 jiu1",
    "faan": 13, // Limit
    "description": "1 and 9 of each suit + all dragons and winds + 1 pair of any of them.",
    "image": "thirteen_orphans.png"
  },
  {
    "category": "Winning Condition / 食胡",
    "name_en": "Self-Pick / Tsumo",
    "name_zh": "自摸",
    "pinyin": "zì mō",
    "jyutping": "zi6 mo1",
    "faan": 1,
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
    "description": "Winning by self-picking the very last tile of the wall.",
    "image": "moon.png"
  }
];
