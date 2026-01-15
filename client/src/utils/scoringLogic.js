
// Helper to parse tile filenames
export const parseTile = (filename) => {
  if (!filename) return null;
  const name = filename.replace('.png', '');

  // Suits
  if (name.includes('_circles')) return { type: 'suit', suit: 'circles', value: parseInt(name.split('_')[0]) };
  if (name.includes('_man')) return { type: 'suit', suit: 'man', value: parseInt(name.split('_')[0]) };
  if (name.includes('_sticks')) return { type: 'suit', suit: 'sticks', value: parseInt(name.split('_')[0]) };

  // Dragons
  if (name === 'red_dragon') return { type: 'dragon', value: 'red' };
  if (name === 'green_dragon') return { type: 'dragon', value: 'green' };
  if (name === 'white_dragon') return { type: 'dragon', value: 'white' };

  // Winds
  if (name === 'east') return { type: 'wind', value: 'east' };
  if (name === 'south') return { type: 'wind', value: 'south' };
  if (name === 'west') return { type: 'wind', value: 'west' };
  if (name === 'north') return { type: 'wind', value: 'north' };

  // Flowers/Seasons
  if (name.includes('flower')) return { type: 'flower', value: parseInt(name.split('_')[0]) };
  if (name.includes('season')) return { type: 'season', value: parseInt(name.split('_')[0]) };

  return { type: 'unknown', name };
};

// --- Pattern Checkers ---

const countTiles = (tiles) => {
  const counts = {};
  tiles.forEach(t => {
    counts[t] = (counts[t] || 0) + 1;
  });
  return counts;
};

const getTileObjects = (tiles) => tiles.map(parseTile).filter(t => t);

export const calculateScore = (tiles, settings = {}) => {
  const tileObjs = getTileObjects(tiles);
  const patterns = [];
  let totalFaan = 0;

  if (tileObjs.length === 0) return { totalFaan: 0, patterns: [] };

  // Helper counts
  const suitCounts = { circles: 0, man: 0, sticks: 0 };
  const honorCounts = { dragon: 0, wind: 0 };
  const dragonSpecific = { red: 0, green: 0, white: 0 };
  const windSpecific = { east: 0, south: 0, west: 0, north: 0 };
  const tileCounts = countTiles(tiles);

  let terminalsCount = 0;
  let honorsCount = 0;

  tileObjs.forEach(t => {
    if (t.type === 'suit') {
      suitCounts[t.suit]++;
      if (t.value === 1 || t.value === 9) terminalsCount++;
    } else if (t.type === 'dragon') {
      honorCounts.dragon++;
      dragonSpecific[t.value]++;
      honorsCount++;
    } else if (t.type === 'wind') {
      honorCounts.wind++;
      windSpecific[t.value]++;
      honorsCount++;
    }
  });

  const totalTiles = tileObjs.length;

  // 1. Suit Patterns
  // All One Suit (Qing Yi Se)
  if (suitCounts.circles === totalTiles || suitCounts.man === totalTiles || suitCounts.sticks === totalTiles) {
    patterns.push({ name: 'All One Suit / 清一色', faan: 7 });
  }
  // Mixed One Suit (Hun Yi Se)
  else if (
    (suitCounts.circles + honorsCount === totalTiles && suitCounts.circles > 0 && honorsCount > 0) ||
    (suitCounts.man + honorsCount === totalTiles && suitCounts.man > 0 && honorsCount > 0) ||
    (suitCounts.sticks + honorsCount === totalTiles && suitCounts.sticks > 0 && honorsCount > 0)
  ) {
    patterns.push({ name: 'Mixed One Suit / 混一色', faan: 3 });
  }

  // 2. Honors
  // Dragon Pungs (1 faan each)
  if (dragonSpecific.red >= 3) patterns.push({ name: 'Red Dragon Pung / 红中', faan: 1 });
  if (dragonSpecific.green >= 3) patterns.push({ name: 'Green Dragon Pung / 发财', faan: 1 });
  if (dragonSpecific.white >= 3) patterns.push({ name: 'White Dragon Pung / 白板', faan: 1 });

  // Big Three Dragons (Da San Yuan)
  if (dragonSpecific.red >= 3 && dragonSpecific.green >= 3 && dragonSpecific.white >= 3) {
    patterns.push({ name: 'Big Three Dragons / 大三元', faan: 8 });
  }
  // Small Three Dragons (Xiao San Yuan)
  else if (
    (dragonSpecific.red >= 3 && dragonSpecific.green >= 3 && dragonSpecific.white === 2) ||
    (dragonSpecific.red >= 3 && dragonSpecific.white >= 3 && dragonSpecific.green === 2) ||
    (dragonSpecific.green >= 3 && dragonSpecific.white >= 3 && dragonSpecific.red === 2)
  ) {
    patterns.push({ name: 'Small Three Dragons / 小三元', faan: 5 });
  }

  // Dragon Variants (Jade/Ruby/Pearl)
  // Jade: Sticks + Green Dragon
  if (suitCounts.sticks + dragonSpecific.green === totalTiles && dragonSpecific.green >= 3 && suitCounts.sticks > 0) {
     patterns.push({ name: 'Jade Dragon / 翡翠龙', faan: 6 });
  }
  // Ruby: Man + Red Dragon
  if (suitCounts.man + dragonSpecific.red === totalTiles && dragonSpecific.red >= 3 && suitCounts.man > 0) {
    patterns.push({ name: 'Ruby Dragon / 红宝龙', faan: 6 });
  }
  // Pearl: Circles + White Dragon
  if (suitCounts.circles + dragonSpecific.white === totalTiles && dragonSpecific.white >= 3 && suitCounts.circles > 0) {
    patterns.push({ name: 'Pearl Dragon / 珍珠龙', faan: 6 });
  }

  // Winds
  // Big Four Winds
  if (windSpecific.east >= 3 && windSpecific.south >= 3 && windSpecific.west >= 3 && windSpecific.north >= 3) {
    patterns.push({ name: 'Big Four Winds / 大四喜', faan: 13 });
  }
  // Small Four Winds
  else if (
    Object.values(windSpecific).filter(c => c >= 3).length === 3 && Object.values(windSpecific).filter(c => c === 2).length === 1
  ) {
    patterns.push({ name: 'Small Four Winds / 小四喜', faan: 10 });
  }

  // 3. Terminals / Honors
  // All Honors
  if (honorsCount === totalTiles && totalTiles > 0) {
    patterns.push({ name: 'All Honors / 字一色', faan: 13 });
  }
  // All Terminals (Qing Lao Tou)
  else if (terminalsCount === totalTiles && totalTiles > 0 && honorsCount === 0) {
    patterns.push({ name: 'All Terminals / 清么九', faan: 13 });
  }
  // Mixed Terminals (Hun Lao Tou)
  else if (terminalsCount + honorsCount === totalTiles && terminalsCount > 0 && honorsCount > 0) {
    patterns.push({ name: 'Mixed Terminals / 混老头', faan: 7 });
  }

  // 4. Thirteen Orphans (Shi San Yao)
  const isUniqueTerminalsHonors = () => {
    const required = [
      '1_circles', '9_circles', '1_man', '9_man', '1_sticks', '9_sticks',
      'east', 'south', 'west', 'north', 'red_dragon', 'green_dragon', 'white_dragon'
    ];
    const tileNames = tiles.map(t => t.replace('.png', ''));
    const hasAll = required.every(req => tileNames.includes(req));
    return hasAll;
  };
  if (totalTiles >= 13 && isUniqueTerminalsHonors()) {
    patterns.push({ name: 'Thirteen Orphans / 十三幺', faan: 13 });
  }

  // 5. All Pungs (Triplets) Heuristic
  // Check if all tiles belong to sets of >=2
  const counts = Object.values(tileCounts);
  const isAllPungs = counts.every(c => c >= 2 || c === 4) &&
                     (counts.filter(c => c === 2).length === 1) && // exactly one pair
                     (counts.filter(c => c >= 3).length === 4); // 4 pungs/kongs

  if (totalTiles === 14 && isAllPungs) {
     patterns.push({ name: 'All Pungs / 对对胡', faan: 3 });
  }

  // 6. Nine Gates
  const checkNineGates = (suit) => {
    if (suitCounts[suit] !== 14) return false;
    const suitTiles = tileObjs.filter(t => t.suit === suit).map(t => t.value).sort((a,b)=>a-b);

    const handCounts = {};
    suitTiles.forEach(v => handCounts[v] = (handCounts[v]||0)+1);

    // Check mandatory counts for Nine Gates
    if (handCounts[1] < 3) return false;
    if (handCounts[9] < 3) return false;
    for(let i=2; i<=8; i++) {
        if (!handCounts[i] || handCounts[i] < 1) return false;
    }
    return true;
  };

  if (checkNineGates('circles') || checkNineGates('man') || checkNineGates('sticks')) {
      patterns.push({ name: 'Nine Gates / 九莲宝灯', faan: 13 });
  }


  // 7. Settings-based
  if (settings.flowers) {
    if (settings.flowers === 'no_flowers') {
        patterns.push({ name: 'No Flowers / 无花', faan: 1 });
    }
    if (settings.flowers === 'own_flower') {
        patterns.push({ name: 'Own Flower / 正花', faan: 1 });
    }
    if (settings.flowers === 'full_set') {
        patterns.push({ name: 'Full Set Flowers / 一台花', faan: 2 });
    }
    if (settings.flowers === 'all_eight') {
        patterns.push({ name: 'All Eight Flowers / 八仙过海', faan: 13 });
    }
  }

  if (settings.concealed) {
    patterns.push({ name: 'Concealed Hand / 门前清', faan: 1 });
  }

  // Deduplication
  const toRemove = new Set();

  if (patterns.some(p => p.name.includes('Big Three Dragons'))) {
      patterns.forEach((p, i) => {
          if (p.name.includes('Dragon Pung')) toRemove.add(i);
      });
  }

  const isLimit = patterns.some(p => p.faan >= 13);

  if (!isLimit) {
      if (patterns.some(p => p.name.includes('Jade Dragon'))) {
          patterns.forEach((p, i) => { if (p.name.includes('Green Dragon Pung')) toRemove.add(i); });
      }
      if (patterns.some(p => p.name.includes('Ruby Dragon'))) {
          patterns.forEach((p, i) => { if (p.name.includes('Red Dragon Pung')) toRemove.add(i); });
      }
      if (patterns.some(p => p.name.includes('Pearl Dragon'))) {
          patterns.forEach((p, i) => { if (p.name.includes('White Dragon Pung')) toRemove.add(i); });
      }
  }

  const finalPatterns = patterns.filter((_, i) => !toRemove.has(i));
  totalFaan = finalPatterns.reduce((sum, p) => sum + p.faan, 0);

  return { totalFaan, patterns: finalPatterns };
};

export const getSuggestions = (tiles) => {
  const tileObjs = getTileObjects(tiles);
  const suggestions = [];
  const totalTiles = tileObjs.length;
  if (totalTiles === 0) return [];

  const suitCounts = { circles: 0, man: 0, sticks: 0 };
  const honorCounts = { dragon: 0, wind: 0, total: 0 };

  tileObjs.forEach(t => {
    if (t.type === 'suit') suitCounts[t.suit]++;
    if (t.type === 'dragon' || t.type === 'wind') {
      honorCounts.total++;
      if (t.type === 'dragon') honorCounts.dragon++;
      if (t.type === 'wind') honorCounts.wind++;
    }
  });

  // 1. Mixed One Suit
  ['circles', 'man', 'sticks'].forEach(suit => {
    const count = suitCounts[suit] + honorCounts.total;
    const diff = 14 - count;
    if (diff <= 4 && diff > 0) {
      suggestions.push({
        name: `Mixed One Suit (${suit})`,
        diff,
        message: `Need ${diff} more ${suit}/honor tiles. Remove others.`
      });
    }
  });

  // 2. All One Suit
  ['circles', 'man', 'sticks'].forEach(suit => {
    const count = suitCounts[suit];
    const diff = 14 - count;
    if (diff <= 5 && diff > 0) {
      suggestions.push({
        name: `All One Suit (${suit})`,
        diff,
        message: `Need ${diff} more ${suit} tiles.`
      });
    }
  });

  // 3. All Honors
  const diffHonors = 14 - honorCounts.total;
  if (diffHonors <= 5 && diffHonors > 0) {
    suggestions.push({
        name: 'All Honors',
        diff: diffHonors,
        message: `Need ${diffHonors} more honor tiles.`
    });
  }

  // Sort by difficulty (diff)
  suggestions.sort((a, b) => a.diff - b.diff);

  return suggestions;
};
