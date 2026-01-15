import React, { useState, useMemo } from 'react';
import { calculateScore, getSuggestions } from '../utils/scoringLogic';

const TILE_GROUPS = {
  circles: Array.from({ length: 9 }, (_, i) => `${i + 1}_circles.png`),
  man: Array.from({ length: 9 }, (_, i) => `${i + 1}_man.png`),
  sticks: Array.from({ length: 9 }, (_, i) => `${i + 1}_sticks.png`),
  dragons: ['red_dragon.png', 'green_dragon.png', 'white_dragon.png'],
  winds: ['east.png', 'south.png', 'west.png', 'north.png']
};

export default function HandCalculator() {
  const [hand, setHand] = useState([]);
  const [settings, setSettings] = useState({
    concealed: false,
    flowers: 'none' // 'none', 'no_flowers', 'own_flower', 'full_set', 'all_eight'
  });

  // Refactored to use useMemo to avoid setState in useEffect lint error
  const results = useMemo(() => calculateScore(hand, settings), [hand, settings]);
  const suggestions = useMemo(() => getSuggestions(hand), [hand]);

  const addTile = (filename) => {
    if (hand.length >= 14) return;
    const count = hand.filter(t => t === filename).length;
    if (count >= 4) return;
    setHand([...hand, filename]);
  };

  const removeTile = (index) => {
    const newHand = [...hand];
    newHand.splice(index, 1);
    setHand(newHand);
  };

  const clearHand = () => setHand([]);

  // Group styles
  const groupStyle = { marginBottom: '20px' };
  const groupTitleStyle = { fontSize: '1.1em', fontWeight: 'bold', marginBottom: '8px', color: '#ccc' };
  const tileGridStyle = { display: 'flex', flexWrap: 'wrap', gap: '8px' };

  return (
    <div className="hand-calculator" style={{ padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', color: 'white' }}>

      {/* --- Settings --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={settings.concealed}
            onChange={(e) => setSettings({...settings, concealed: e.target.checked})}
            style={{ width: '20px', height: '20px' }}
          />
          <span style={{ fontSize: '1.1em' }}>Concealed Hand (门前清)</span>
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Flowers/Seasons:</span>
          <select
            value={settings.flowers}
            onChange={(e) => setSettings({...settings, flowers: e.target.value})}
            style={{ padding: '5px', fontSize: '1em', borderRadius: '4px' }}
          >
            <option value="none">Ignore (0 Faan)</option>
            <option value="no_flowers">No Flowers (1 Faan)</option>
            <option value="own_flower">1 Own Flower (1 Faan)</option>
            <option value="full_set">Full Set (2 Faan)</option>
            <option value="all_eight">All Eight (Limit)</option>
          </select>
        </div>
      </div>

      {/* --- Selected Hand --- */}
      <div style={{ marginBottom: '30px', minHeight: '120px', border: '2px dashed #666', borderRadius: '8px', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Your Hand ({hand.length}/14)</span>
          <button onClick={clearHand} style={{ padding: '5px 10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {hand.map((tile, idx) => (
            <div key={idx} onClick={() => removeTile(idx)} style={{ cursor: 'pointer', position: 'relative' }} title="Click to remove">
              <img src={`/hand_images/${tile}`} alt={tile} style={{ height: '60px' }} />
            </div>
          ))}
          {hand.length === 0 && <span style={{ color: '#888', alignSelf: 'center', width: '100%', textAlign: 'center' }}>Click tiles below to add them to your hand.</span>}
        </div>
      </div>

      {/* --- Results --- */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>

        {/* Score Panel */}
        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(0,100,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid #4CAF50' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #4CAF50', paddingBottom: '5px' }}>Total Faan: <span style={{ fontSize: '1.5em', color: '#4CAF50' }}>{results.totalFaan}</span></h3>
          {results.patterns.length > 0 ? (
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {results.patterns.map((p, i) => (
                <li key={i} style={{ marginBottom: '5px' }}>
                  <strong>{p.name}</strong> ({p.faan} Faan)
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#aaa' }}>No scoring patterns found yet.</p>
          )}
        </div>

        {/* Suggestions Panel */}
        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(0,0,100,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid #2196F3' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #2196F3', paddingBottom: '5px' }}>Suggestions</h3>
          {suggestions.length > 0 ? (
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {suggestions.map((s, i) => (
                <li key={i} style={{ marginBottom: '5px' }}>
                  <strong>{s.name}</strong>: {s.message}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#aaa' }}>Add more tiles to see suggestions.</p>
          )}
        </div>

      </div>

      {/* --- Tile Selector --- */}
      <div>
        <h3>Add Tiles</h3>

        <div style={groupStyle}>
          <div style={groupTitleStyle}>Circles / 筒子</div>
          <div style={tileGridStyle}>
            {TILE_GROUPS.circles.map(tile => (
              <TileButton key={tile} tile={tile} hand={hand} addTile={addTile} />
            ))}
          </div>
        </div>

        <div style={groupStyle}>
          <div style={groupTitleStyle}>Characters (Man) / 万子</div>
          <div style={tileGridStyle}>
            {TILE_GROUPS.man.map(tile => (
              <TileButton key={tile} tile={tile} hand={hand} addTile={addTile} />
            ))}
          </div>
        </div>

        <div style={groupStyle}>
          <div style={groupTitleStyle}>Bamboo (Sticks) / 索子</div>
          <div style={tileGridStyle}>
            {TILE_GROUPS.sticks.map(tile => (
              <TileButton key={tile} tile={tile} hand={hand} addTile={addTile} />
            ))}
          </div>
        </div>

        <div style={groupStyle}>
          <div style={groupTitleStyle}>Honors (Dragons & Winds) / 番子</div>
          <div style={tileGridStyle}>
            {TILE_GROUPS.dragons.map(tile => (
              <TileButton key={tile} tile={tile} hand={hand} addTile={addTile} />
            ))}
            {TILE_GROUPS.winds.map(tile => (
              <TileButton key={tile} tile={tile} hand={hand} addTile={addTile} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const TileButton = ({ tile, hand, addTile }) => {
  const count = hand.filter(t => t === tile).length;
  const disabled = count >= 4 || hand.length >= 14;

  return (
    <button
      onClick={() => addTile(tile)}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: 'none',
        border: 'none',
        padding: 0
      }}
    >
      <img
        src={`/hand_images/${tile}`}
        alt={tile}
        style={{ height: '50px', borderRadius: '4px', border: '1px solid #444' }}
      />
      <div style={{ textAlign: 'center', fontSize: '10px', color: '#aaa' }}>{count}/4</div>
    </button>
  );
};
