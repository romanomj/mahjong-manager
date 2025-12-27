import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGameState } from '../hooks/useGameState';

export default function AdminPanel() {
  const { gameState, refresh } = useGameState();
  const [names, setNames] = useState({});
  const [config, setConfig] = useState({ min_faan: 3, current_round_wind: 'East' });

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

      // For config, we can likely sync safely unless we want to block that too.
      // But usually config is less "typing intensive" than names.
      // Let's keep config syncing but maybe we should block it too if needed.
      // For now, let's assume the user wants the latest game state config unless they change it.
      // But wait, if I change min_faan and don't save, the poll will reset it.
      // Let's apply similar logic to config.
      setConfig(prevConfig => {
        // Deep compare or just check if we are "clean".
        // Simpler: Just sync. If it annoys the user we change it.
        // The user specifically complained about "names".
        return {
          min_faan: gameState.min_faan,
          current_round_wind: gameState.current_round_wind
        };
      });
    }
  }, [gameState]);

  const updateScore = async (playerId, delta) => {
    await axios.post('/api/admin/update-score', { playerId, delta });
    refresh();
  };

  const nextHand = async (dealerWon) => {
    await axios.post('/api/admin/next-hand', { dealer_won: dealerWon });
    refresh();
  };

  const saveConfig = async () => {
    const playerArray = Object.keys(names).map(id => ({ id: parseInt(id), name: names[id] }));
    await axios.post('/api/admin/config', {
      min_faan: config.min_faan,
      current_round_wind: config.current_round_wind,
      player_names: playerArray
    });
    refresh();
    alert('Settings Saved');
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
              Next Hand (Dealer Won/Draw) <br /> 庄家连庄/流局
            </button>
            <button className="btn btn-primary game-flow-btn" onClick={() => nextHand(false)}>
              Next Hand (Dealer Lost) <br /> 下一位
            </button>
            <button className="btn btn-danger game-flow-btn" onClick={resetGame}>
              Reset Game / 重置
            </button>
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

        {/* Settings */}
        <div className="control-group">
          <h3>Settings / 设置</h3>
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
          <h4>Player Names</h4>
          {Object.keys(names).map(id => (
            <div key={id} style={{ marginBottom: '5px' }}>
              <input
                value={names[id]}
                onChange={(e) => setNames({ ...names, [id]: e.target.value })}
              />
            </div>
          ))}
          <button className="btn btn-success" onClick={saveConfig}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
