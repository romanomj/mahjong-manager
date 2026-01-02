import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGameState } from '../hooks/useGameState';

export default function AdminPanel() {
  const { gameState, refresh } = useGameState();
  const [names, setNames] = useState({});
  const [config, setConfig] = useState({ min_faan: 3, current_round_wind: 'East', lucky_blessings_enabled: false, lucky_blessings_chance: 10 });
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  // Sync state to local form
  useEffect(() => {
    if (gameState) {
      // Only initialize names if they haven't been set yet (prevents overwriting user input during polling)
      setNames(prevNames => {
        if (Object.keys(prevNames).length === 0) {
          const nameMap = {};
          gameState.players.forEach(p => nameMap[p.id] = p.name);
          return nameMap;
        }
        return prevNames;
      });

      // Only initialize config once to prevent overwriting user input
      if (!isConfigLoaded) {
        setConfig({
          min_faan: gameState.min_faan,
          current_round_wind: gameState.current_round_wind,
          lucky_blessings_enabled: !!gameState.lucky_blessings_enabled,
          lucky_blessings_chance: gameState.lucky_blessings_chance || 10
        });
        setIsConfigLoaded(true);
      }
    }
  }, [gameState, isConfigLoaded]);

  const updateScore = async (playerId, delta) => {
    await axios.post('/api/admin/update-score', { playerId, delta });
    refresh();
  };

  const nextHand = async (dealerWon) => {
    await axios.post('/api/admin/next-hand', { dealer_won: dealerWon });
    refresh();
  };

  const saveGameSettings = async () => {
    await axios.post('/api/admin/config', {
      min_faan: config.min_faan,
      current_round_wind: config.current_round_wind,
      dealer_seat_override: config.dealer_seat_override // In case we add this UI later, but for now just preserving structure if needed. Actually we didn't have this in UI.
    });
    refresh();
    alert('Game Settings Saved');
  };

  const saveBlessings = async () => {
    await axios.post('/api/admin/config', {
      lucky_blessings_enabled: config.lucky_blessings_enabled,
      lucky_blessings_chance: config.lucky_blessings_chance
    });
    refresh();
    alert('Blessings Saved');
  };

  const savePlayerNames = async () => {
    const playerArray = Object.keys(names).map(id => ({ id: parseInt(id), name: names[id] }));
    await axios.post('/api/admin/config', {
      player_names: playerArray
    });
    refresh();
    alert('Player Names Saved');
  };

  const updateRotation = async (direction) => {
    // direction: 1 for CCW? or just delta
    // We need current rotation from gameState
    const currentRot = gameState.layout_rotation || 0;
    const newRot = (currentRot + direction + 4) % 4;

    await axios.post('/api/admin/update-rotation', { rotation: newRot });
    refresh();
  };

  const rollDice = async () => {
    if (window.confirm("Roll dice? This will trigger animation on Main Display.")) {
      await axios.post('/api/admin/roll-dice');
      refresh();
    }
  };

  const toggleMusic = async (enabled) => {
    await axios.post('/api/admin/toggle-music', { enabled });
    refresh();
  };

  const resetGame = async () => {
    if (window.confirm("Are you sure you want to reset the game? This clears scores.")) {
      await axios.post('/api/admin/reset');
      refresh();
    }
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2>Admin Panel / 管理员</h2>

        {/* Game Control */}
        <div className="control-group">
          <h3>Game Flow / 游戏流程</h3>
          <p>Current Round Wind: {gameState.current_round_wind}</p>
          <div className="game-flow-actions">
            <button className="btn btn-success game-flow-btn" onClick={() => nextHand(true)}>
              Next Hand (Dealer Won) <br /> 庄家连庄
            </button>
            <button className="btn btn-primary game-flow-btn" onClick={() => nextHand(false)}>
              Next Hand (Draw / Dealer Lost) <br /> 流局 / 下一位
            </button>
            <button className="btn btn-danger game-flow-btn" onClick={resetGame}>
              Reset Game / 重置
            </button>
          </div>

          {/* Rotation Controls */}
          <div style={{ marginTop: '10px' }}>
            <h4>Seat Display Rotation / 座位旋转</h4>
            <div className="game-flow-actions">
              <button className="btn game-flow-btn" onClick={() => updateRotation(-1)}>
                Rotate CW <br /> 顺时针
              </button>
              <button className="btn game-flow-btn" onClick={() => updateRotation(1)}>
                Rotate CCW <br /> 逆时针
              </button>
            </div>
          </div>

          {/* Dice Roller */}
          <div style={{ marginTop: '10px' }}>
            <h4>Dice Roller / 掷骰子</h4>
            <div className="game-flow-actions">
              <button className="btn btn-warning game-flow-btn" onClick={rollDice}>
                Roll Dice (3-18) <br /> 掷骰子
              </button>
            </div>

            <h4 style={{ marginTop: '20px' }}>Audio Control / 音频控制</h4>
            <div className="game-flow-actions">
              <button
                className={`btn game-flow-btn ${gameState.music_enabled ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => toggleMusic(!gameState.music_enabled)}
              >
                {gameState.music_enabled ? 'Music ON / 音乐开' : 'Music OFF / 音乐关'}
              </button>
            </div>
          </div>
        </div>

        {/* Score Adjustment */}
        <div className="control-group">
          <h3>Scores / 分数</h3>
          {gameState.players.map(p => (
            <div key={p.id} className="score-controls">
              <span>{p.name} ({p.current_wind}): <strong>{p.score}</strong></span>
              <button className="btn" onClick={() => updateScore(p.id, 1)}>+1</button>
              <button className="btn" onClick={() => updateScore(p.id, 5)}>+5</button>
              <button className="btn" onClick={() => updateScore(p.id, 10)}>+10</button>
              <button className="btn" onClick={() => updateScore(p.id, -1)}>-1</button>
              <button className="btn" onClick={() => updateScore(p.id, -5)}>-5</button>
            </div>
          ))}
        </div>

        {/* Settings Area */}
        <div className="control-group">
          <h3>Settings / 设置</h3>

          {/* Section 1: Core Game Settings */}
          <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #555' }}>
            <h4>Round Settings / 回合设置</h4>
            <div style={{ marginBottom: '10px' }}>
              <label>Min Faan / 最小番: </label>
              <input
                type="number"
                value={config.min_faan}
                onChange={(e) => setConfig({ ...config, min_faan: parseInt(e.target.value) })}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Round Wind / 圈风: </label>
              <select
                value={config.current_round_wind}
                onChange={(e) => setConfig({ ...config, current_round_wind: e.target.value })}
              >
                <option value="East">East / 东</option>
                <option value="South">South / 南</option>
                <option value="West">West / 西</option>
                <option value="North">North / 北</option>
              </select>
            </div>
            <button className="btn btn-success" onClick={saveGameSettings}>Save Game Settings</button>
          </div>

          {/* Section 2: Lucky Blessings */}
          <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #555' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Lucky Blessings / 鸿运当头</h4>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ marginRight: '10px' }}>Enabled / 开启: </label>
              <input
                type="checkbox"
                checked={config.lucky_blessings_enabled}
                onChange={(e) => setConfig({ ...config, lucky_blessings_enabled: e.target.checked })}
                style={{ width: '20px', height: '20px' }}
              />
            </div>
            {config.lucky_blessings_enabled && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ marginRight: '10px' }}>Chance % / 概率 (%): </label>
                <input
                  type="number"
                  min="0" max="100"
                  value={config.lucky_blessings_chance}
                  onChange={(e) => setConfig({ ...config, lucky_blessings_chance: parseInt(e.target.value) })}
                  style={{ width: '60px' }}
                />
              </div>
            )}
            <button className="btn btn-success" onClick={saveBlessings}>Save Blessings</button>
          </div>

          {/* Section 3: Player Names */}
          <div>
            <h4>Player Names / 玩家姓名</h4>
            {Object.keys(names).map(id => (
              <div key={id} style={{ marginBottom: '5px' }}>
                <input
                  value={names[id]}
                  onChange={(e) => setNames({ ...names, [id]: e.target.value })}
                />
              </div>
            ))}
            <button className="btn btn-success" style={{ marginTop: '10px' }} onClick={savePlayerNames}>Save Names</button>
          </div>

        </div>
      </div >
    </div >
  );
}
