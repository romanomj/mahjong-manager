
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
  if (name.includes('flower') || name.includes('flowers')) return { type: 'flower', value: parseInt(name.split('_')[0]) };
  if (name.includes('season') || name.includes('seasons')) return { type: 'season', value: parseInt(name.split('_')[0]) };

  return { type: 'unknown', name };
};

const getTileObjects = (tiles) => tiles.map(parseTile).filter(t => t);

// --- Logic Helpers ---

// Check if a set of tiles (of one suit) can be formed entirely of sequences (chows)
const canFormSequences = (counts) => {
    // Clone counts to modify
    const temp = { ...counts };
    const values = Object.keys(temp).map(Number).sort((a,b) => a-b);

    for (const v of values) {
        while (temp[v] > 0) {
            if (temp[v+1] > 0 && temp[v+2] > 0) {
                temp[v]--;
                temp[v+1]--;
                temp[v+2]--;
            } else {
                return false;
            }
        }
    }
    return true;
};

// Check if the whole hand forms a valid Mahjong hand (4 sets + 1 pair)
// Returns { valid: boolean, isAllChows: boolean }
const checkStructure = (structuralTiles) => {
    if (structuralTiles.length !== 14) return { valid: false, isAllChows: false };

    // Group by suit/honor
    const suits = { circles: [], man: [], sticks: [] };
    const honors = [];

    structuralTiles.forEach(t => {
        if (t.type === 'suit') suits[t.suit].push(t.value);
        else honors.push(t);
    });

    // Helper to count array
    const countArr = (arr) => {
        const c = {};
        arr.forEach(x => c[x] = (c[x]||0)+1);
        return c;
    };

    // Try every tile as a pair
    const uniqueTiles = [];
    structuralTiles.forEach(t => {
        const key = t.type === 'suit' ? `${t.suit}_${t.value}` : `${t.type}_${t.value}`;
        if (!uniqueTiles.includes(key)) uniqueTiles.push({ key, t });
    });

    for (const { t: pairTile } of uniqueTiles) {
        // Remove pair
        const remainingSuits = {
            circles: countArr(suits.circles),
            man: countArr(suits.man),
            sticks: countArr(suits.sticks)
        };
        const remainingHonors = countArr(honors.map(h => `${h.type}_${h.value}`));

        let pairRemoved = false;

        if (pairTile.type === 'suit') {
            if (remainingSuits[pairTile.suit][pairTile.value] >= 2) {
                remainingSuits[pairTile.suit][pairTile.value] -= 2;
                pairRemoved = true;
            }
        } else {
            const k = `${pairTile.type}_${pairTile.value}`;
            if (remainingHonors[k] >= 2) {
                remainingHonors[k] -= 2;
                pairRemoved = true;
            }
        }

        if (!pairRemoved) continue;

        // Now check if rest can be decomposed
        // Honors must be in triplets (since sequences not allowed)
        let honorsOk = true;
        for (const k in remainingHonors) {
            if (remainingHonors[k] !== 0 && remainingHonors[k] !== 3 && remainingHonors[k] !== 4) { // 4 for Kong? assume 3 for now, 4 handled as 3 + 1? No 14 tiles implies regular
               // If we have a Kong, we usually have an extra tile.
               // Standard hand = 14 tiles. So 4 sets of 3 + pair.
               if (remainingHonors[k] !== 3) honorsOk = false;
            }
        }
        if (!honorsOk) continue;

        // Suits can be triplets or sequences
        // To check "All Chows", we must enforce sequences only
        // To check "Valid", we allow both

        let allSuitsAsSequences = true;
        let allSuitsValid = true;

        for (const s of ['circles', 'man', 'sticks']) {
            const c = remainingSuits[s];
            // Check All Chows condition (strict sequences)
            if (!canFormSequences({...c})) {
                allSuitsAsSequences = false;
            }

            // Check Validity (general backtracking)
            // Simple backtracking: try removing triplet, then try sequence
            const canFormValid = (counts) => {
                const keys = Object.keys(counts).map(Number).sort((a,b)=>a-b).filter(k => counts[k]>0);
                if (keys.length === 0) return true;

                const first = keys[0];

                // Try Triplet
                if (counts[first] >= 3) {
                    counts[first] -= 3;
                    if (canFormValid(counts)) return true;
                    counts[first] += 3; // backtrack
                }

                // Try Sequence
                if (counts[first+1] > 0 && counts[first+2] > 0) {
                    counts[first]--;
                    counts[first+1]--;
                    counts[first+2]--;
                    if (canFormValid(counts)) return true;
                    counts[first]++;
                    counts[first+1]++;
                    counts[first+2]++; // backtrack
                }

                return false;
            };

            if (!canFormValid({...c})) {
                allSuitsValid = false;
            }
        }

        if (allSuitsValid) {
            // It is a valid hand!
            // Is it All Chows?
            // All Chows = All sequences + Pair (usually non-honor? standard HK: ping hu = no flowers, all chows. Pair can be honor?
            // Strict: Ping Hu pair cannot be Dragon or Seat/Round Wind.
            // Loose: If honors count == 0 (meaning pair was suit), and allSuitsAsSequences is true.
            // If pair was honor, and remaining honors are 0 (empty), and allSuitsAsSequences is true.
            // Wait, if pair is honor, can it be Ping Hu?
            // "Pair is not dragons or seat/round wind."
            // So if pair is Dragon -> No.

            const pairIsDragon = pairTile.type === 'dragon';
            // We don't know winds, so assume wind pair is OK for now (or maybe just forbid if we want to be strict?)
            // Let's assume Wind pair is OK (as per many variations unless Seat/Round).

            // Honors used in sets (triplets) -> Not Ping Hu (Ping Hu = No Pungs).
            // So if honors count > 0 after removing pair -> We had honor triplets -> Not Ping Hu.
            const hasHonorSets = Object.values(remainingHonors).some(x => x > 0);

            if (!hasHonorSets && allSuitsAsSequences && !pairIsDragon) {
                 return { valid: true, isAllChows: true };
            }
            return { valid: true, isAllChows: false };
        }
    }

    return { valid: false, isAllChows: false };
};


export const calculateScore = (tiles, settings = {}) => {
  const allTileObjs = getTileObjects(tiles);

  const bonusTiles = allTileObjs.filter(t => t.type === 'flower' || t.type === 'season');
  const structuralTiles = allTileObjs.filter(t => t.type !== 'flower' && t.type !== 'season');

  const patterns = [];
  let totalFaan = 0;

  if (structuralTiles.length === 0 && bonusTiles.length === 0) return { totalFaan: 0, patterns: [] };

  const suitCounts = { circles: 0, man: 0, sticks: 0 };
  const honorCounts = { dragon: 0, wind: 0 };
  const dragonSpecific = { red: 0, green: 0, white: 0 };
  const windSpecific = { east: 0, south: 0, west: 0, north: 0 };

  let terminalsCount = 0;
  let honorsCount = 0;

  structuralTiles.forEach(t => {
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

  const totalStructuralTiles = structuralTiles.length;

  // 1. Suit Patterns
  if (suitCounts.circles === totalStructuralTiles || suitCounts.man === totalStructuralTiles || suitCounts.sticks === totalStructuralTiles) {
    if (totalStructuralTiles > 0) patterns.push({ name: 'All One Suit / 清一色', faan: 7 });
  }
  else if (
    (suitCounts.circles + honorsCount === totalStructuralTiles && suitCounts.circles > 0 && honorsCount > 0) ||
    (suitCounts.man + honorsCount === totalStructuralTiles && suitCounts.man > 0 && honorsCount > 0) ||
    (suitCounts.sticks + honorsCount === totalStructuralTiles && suitCounts.sticks > 0 && honorsCount > 0)
  ) {
    patterns.push({ name: 'Mixed One Suit / 混一色', faan: 3 });
  }

  // 2. Honors
  if (dragonSpecific.red >= 3) patterns.push({ name: 'Red Dragon Pung / 红中', faan: 1 });
  if (dragonSpecific.green >= 3) patterns.push({ name: 'Green Dragon Pung / 发财', faan: 1 });
  if (dragonSpecific.white >= 3) patterns.push({ name: 'White Dragon Pung / 白板', faan: 1 });

  if (dragonSpecific.red >= 3 && dragonSpecific.green >= 3 && dragonSpecific.white >= 3) {
    patterns.push({ name: 'Big Three Dragons / 大三元', faan: 8 });
  }
  else if (
    (dragonSpecific.red >= 3 && dragonSpecific.green >= 3 && dragonSpecific.white === 2) ||
    (dragonSpecific.red >= 3 && dragonSpecific.white >= 3 && dragonSpecific.green === 2) ||
    (dragonSpecific.green >= 3 && dragonSpecific.white >= 3 && dragonSpecific.red === 2)
  ) {
    patterns.push({ name: 'Small Three Dragons / 小三元', faan: 5 });
  }

  // Dragon Variants
  if (suitCounts.sticks + dragonSpecific.green === totalStructuralTiles && dragonSpecific.green >= 3 && suitCounts.sticks > 0) {
     patterns.push({ name: 'Jade Dragon / 翡翠龙', faan: 6 });
  }
  if (suitCounts.man + dragonSpecific.red === totalStructuralTiles && dragonSpecific.red >= 3 && suitCounts.man > 0) {
    patterns.push({ name: 'Ruby Dragon / 红宝龙', faan: 6 });
  }
  if (suitCounts.circles + dragonSpecific.white === totalStructuralTiles && dragonSpecific.white >= 3 && suitCounts.circles > 0) {
    patterns.push({ name: 'Pearl Dragon / 珍珠龙', faan: 6 });
  }

  // Winds
  if (windSpecific.east >= 3 && windSpecific.south >= 3 && windSpecific.west >= 3 && windSpecific.north >= 3) {
    patterns.push({ name: 'Big Four Winds / 大四喜', faan: 13 });
  }
  else if (
    Object.values(windSpecific).filter(c => c >= 3).length === 3 && Object.values(windSpecific).filter(c => c === 2).length === 1
  ) {
    patterns.push({ name: 'Small Four Winds / 小四喜', faan: 10 });
  }

  // 3. Terminals / Honors
  if (honorsCount === totalStructuralTiles && totalStructuralTiles > 0) {
    patterns.push({ name: 'All Honors / 字一色', faan: 13 });
  }
  else if (terminalsCount === totalStructuralTiles && totalStructuralTiles > 0 && honorsCount === 0) {
    patterns.push({ name: 'All Terminals / 清么九', faan: 13 });
  }
  else if (terminalsCount + honorsCount === totalStructuralTiles && terminalsCount > 0 && honorsCount > 0) {
    patterns.push({ name: 'Mixed Terminals / 混老头', faan: 7 });
  }

  // 4. Thirteen Orphans
  const isUniqueTerminalsHonors = () => {
    const hasOne = (type, value, suit) => {
        return structuralTiles.some(t => {
            if (type === 'dragon' || type === 'wind') return t.type === type && t.value === value;
            if (type === 'suit') return t.type === type && t.suit === suit && t.value === value;
            return false;
        });
    };
    const reqs = [
       {t:'suit', s:'circles', v:1}, {t:'suit', s:'circles', v:9},
       {t:'suit', s:'man', v:1}, {t:'suit', s:'man', v:9},
       {t:'suit', s:'sticks', v:1}, {t:'suit', s:'sticks', v:9},
       {t:'wind', v:'east'}, {t:'wind', v:'south'}, {t:'wind', v:'west'}, {t:'wind', v:'north'},
       {t:'dragon', v:'red'}, {t:'dragon', v:'green'}, {t:'dragon', v:'white'}
    ];
    return reqs.every(r => hasOne(r.t, r.v, r.s));
  };

  if (totalStructuralTiles >= 13 && isUniqueTerminalsHonors()) {
    patterns.push({ name: 'Thirteen Orphans / 十三幺', faan: 13 });
  }

  // 5. All Pungs
  const structCounts = {};
  structuralTiles.forEach(t => {
      const key = t.type === 'suit' ? `${t.value}_${t.suit}` : `${t.value}_${t.type}`;
      structCounts[key] = (structCounts[key] || 0) + 1;
  });
  const counts = Object.values(structCounts);
  const isAllPungs = counts.every(c => c >= 2 || c === 4) &&
                     (counts.filter(c => c === 2).length === 1) &&
                     (counts.filter(c => c >= 3).length === 4);

  if (totalStructuralTiles === 14 && isAllPungs) {
     patterns.push({ name: 'All Pungs / 对对胡', faan: 3 });
  }

  // 6. Nine Gates
  const checkNineGates = (suit) => {
    if (suitCounts[suit] !== 14) return false;
    const suitTiles = structuralTiles.filter(t => t.suit === suit).map(t => t.value).sort((a,b)=>a-b);
    const handCounts = {};
    suitTiles.forEach(v => handCounts[v] = (handCounts[v]||0)+1);
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

  // 7. Common Hand (Ping Hu)
  if (totalStructuralTiles === 14) {
      const { valid, isAllChows } = checkStructure(structuralTiles);
      // Valid hand check isn't strictly enforced for other patterns (e.g. Mixed One Suit) because users might just want to see potential score.
      // But Ping Hu *is* the structure itself.
      if (valid && isAllChows) {
          // Check for flowers
          // Some rules say Ping Hu = No Flowers.
          // scoringData says "All sets are Chows...". Doesn't explicitly forbid flowers in description,
          // but usually Ping Hu + No Flowers = 2 Faan total.
          // Let's award Ping Hu regardless of flowers, and let flowers add points separately.
          patterns.push({ name: 'Common Hand / 平胡', faan: 1 });
      }
  }

  // 8. Settings & Bonus
  if (bonusTiles.length > 0) {
      if (bonusTiles.length === 8) {
          patterns.push({ name: 'All Eight Flowers / 八仙过海', faan: 13 });
      } else {
          patterns.push({ name: `Flowers/Seasons (x${bonusTiles.length})`, faan: bonusTiles.length });
      }
  } else if (settings.flowers) {
      if (settings.flowers === 'no_flowers') patterns.push({ name: 'No Flowers / 无花', faan: 1 });
      if (settings.flowers === 'own_flower') patterns.push({ name: 'Own Flower / 正花', faan: 1 });
      if (settings.flowers === 'full_set') patterns.push({ name: 'Full Set Flowers / 一台花', faan: 2 });
      if (settings.flowers === 'all_eight') patterns.push({ name: 'All Eight Flowers / 八仙过海', faan: 13 });
  }

  if (settings.concealed) patterns.push({ name: 'Concealed Hand / 门前清', faan: 1 });
  if (settings.selfPick) patterns.push({ name: 'Self Pick / 自摸', faan: 1 });

  // Deduplication
  const toRemove = new Set();

  if (patterns.some(p => p.name.includes('Big Three Dragons'))) {
      patterns.forEach((p, i) => { if (p.name.includes('Dragon Pung')) toRemove.add(i); });
      patterns.forEach((p, i) => { if (p.name.includes('Small Three Dragons')) toRemove.add(i); }); // Big covers Small? Usually incompatible.
  }
  if (patterns.some(p => p.name.includes('Big Four Winds'))) {
      patterns.forEach((p, i) => { if (p.name.includes('Small Four Winds')) toRemove.add(i); });
  }

  const isLimit = patterns.some(p => p.faan >= 13);

  if (!isLimit) {
      if (patterns.some(p => p.name.includes('Jade Dragon'))) patterns.forEach((p, i) => { if (p.name.includes('Green Dragon Pung')) toRemove.add(i); });
      if (patterns.some(p => p.name.includes('Ruby Dragon'))) patterns.forEach((p, i) => { if (p.name.includes('Red Dragon Pung')) toRemove.add(i); });
      if (patterns.some(p => p.name.includes('Pearl Dragon'))) patterns.forEach((p, i) => { if (p.name.includes('White Dragon Pung')) toRemove.add(i); });
  }

  const finalPatterns = patterns.filter((_, i) => !toRemove.has(i));
  totalFaan = finalPatterns.reduce((sum, p) => sum + p.faan, 0);

  return { totalFaan, patterns: finalPatterns };
};

export const getSuggestions = (tiles) => {
  const allTileObjs = getTileObjects(tiles);
  const structuralTiles = allTileObjs.filter(t => t.type !== 'flower' && t.type !== 'season');

  const suggestions = [];
  const totalTiles = structuralTiles.length;
  if (totalTiles === 0) return [];

  const suitCounts = { circles: 0, man: 0, sticks: 0 };
  const honorCounts = { dragon: 0, wind: 0, total: 0 };

  // Helpers for counting specifics
  const dragons = { red: 0, green: 0, white: 0 };
  const winds = { east: 0, south: 0, west: 0, north: 0 };
  const tileCounts = {}; // Key: type_val or suit_val

  structuralTiles.forEach(t => {
    if (t.type === 'suit') {
        suitCounts[t.suit]++;
        const k = `${t.suit}_${t.value}`;
        tileCounts[k] = (tileCounts[k] || 0) + 1;
    }
    if (t.type === 'dragon') {
        honorCounts.total++;
        honorCounts.dragon++;
        dragons[t.value]++;
        const k = `dragon_${t.value}`;
        tileCounts[k] = (tileCounts[k] || 0) + 1;
    }
    if (t.type === 'wind') {
        honorCounts.total++;
        honorCounts.wind++;
        winds[t.value]++;
        const k = `wind_${t.value}`;
        tileCounts[k] = (tileCounts[k] || 0) + 1;
    }
  });

  // 1. Dragons
  const dragonPairs = Object.values(dragons).filter(c => c >= 2).length;
  const dragonTriplets = Object.values(dragons).filter(c => c >= 3).length;

  if (dragonTriplets === 2 && dragonPairs === 3) { // 3rd is pair
      suggestions.push({ name: 'Big Three Dragons / 大三元', diff: 1, message: 'Need 1 more dragon for Pung.' });
  } else if (dragonPairs >= 2) {
       // If we have 2+ pairs/triplets, suggest dragons
       const tilesNeeded = 9 - (dragons.red + dragons.green + dragons.white); // Crude estimate
       // Better: Count how many more to form 3 pungs
       let needed = 0;
       ['red', 'green', 'white'].forEach(d => needed += Math.max(0, 3 - dragons[d]));
       if (needed <= 4) {
           suggestions.push({ name: 'Big Three Dragons / 大三元', diff: needed, message: `Need ${needed} more dragon tiles.` });
       }
       // Small Three Dragons (2 pungs + 1 pair)
       // Min needed calculation could be complex, assume approximate
       if (needed <= 5) {
            suggestions.push({ name: 'Small Three Dragons / 小三元', diff: needed - 1, message: `Need approx ${needed-1} tiles.` });
       }
  }

  // 2. Winds
  let windNeeded = 0;
  ['east', 'south', 'west', 'north'].forEach(w => windNeeded += Math.max(0, 3 - winds[w]));
  if (windNeeded <= 5) {
       suggestions.push({ name: 'Big Four Winds / 大四喜', diff: windNeeded, message: `Need ${windNeeded} more wind tiles.` });
  }

  if (windNeeded <= 6) {
      suggestions.push({ name: 'Small Four Winds / 小四喜', diff: Math.max(0, windNeeded - 1), message: `Need approx ${Math.max(0, windNeeded - 1)} more wind tiles.` });
  }

  // 3. All Pungs
  // Count how many pairs/triplets we have
  let pairs = 0;
  let pungs = 0;
  Object.values(tileCounts).forEach(c => {
      if (c >= 3) pungs++;
      else if (c === 2) pairs++;
  });
  // Goal: 4 pungs + 1 pair
  // Current state: P pungs + R pairs.
  // We need to convert (4-P) sets into pungs.
  // We have R pairs to upgrade.
  // Remaining sets need to be formed from singles.
  // This is a heuristic.
  if (pungs + pairs >= 3) {
      suggestions.push({ name: 'All Pungs / 对对胡', diff: 5 - pungs, message: 'Focus on triplets.' });
  }

  // 4. Thirteen Orphans
  const orphanTypes = [
      'circles_1', 'circles_9', 'man_1', 'man_9', 'sticks_1', 'sticks_9',
      'wind_east', 'wind_south', 'wind_west', 'wind_north',
      'dragon_red', 'dragon_green', 'dragon_white'
  ];
  let orphansHeld = 0;
  orphanTypes.forEach(k => {
      if (tileCounts[k]) orphansHeld++;
  });
  if (orphansHeld >= 9) {
      const needed = 13 - orphansHeld; // Plus pair
      suggestions.push({ name: 'Thirteen Orphans / 十三幺', diff: needed, message: `Need ${needed} more unique orphans.` });
  }

  // 5. Suit Patterns (Existing logic)
  ['circles', 'man', 'sticks'].forEach(suit => {
    const count = suitCounts[suit] + honorCounts.total;
    const diff = 14 - count;
    if (diff <= 4 && diff > 0) {
      suggestions.push({
        name: `Mixed One Suit (${suit})`,
        diff,
        message: `Need ${diff} more ${suit}/honor tiles.`
      });
    }
    const strictCount = suitCounts[suit];
    const strictDiff = 14 - strictCount;
    if (strictDiff <= 5 && strictDiff > 0) {
      suggestions.push({
        name: `All One Suit (${suit})`,
        diff: strictDiff,
        message: `Need ${strictDiff} more ${suit} tiles.`
      });
    }
  });

  // 6. All Honors
  const diffHonors = 14 - honorCounts.total;
  if (diffHonors <= 6 && diffHonors > 0) {
    suggestions.push({
        name: 'All Honors',
        diff: diffHonors,
        message: `Need ${diffHonors} more honor tiles.`
    });
  }

  suggestions.sort((a, b) => a.diff - b.diff);
  return suggestions;
};
