import React from 'react';
import { useGameState } from '../hooks/useGameState';

export default function MainDisplay() {
  const { gameState, loading, error } = useGameState();

  if (loading) return <div className="screen">Loading...</div>;
  if (error) return <div className="screen">Error loading game state. Is server running?</div>;
  if (!gameState) return <div className="screen">No game state found.</div>;

  const { current_round_wind, min_faan, players } = gameState;

  // Map winds to Chinese (Traditional)
  const windMap = { 'East': '東', 'South': '南', 'West': '西', 'North': '北' };

  // Map winds to Numbers
  const windNumberMap = { 'East': 1, 'South': 2, 'West': 3, 'North': 4 };

  return (
    <div className="hud-container">
      <div className="hud-info-bar">
        <span>Min Points / 最小番数: {min_faan}</span>
        <span>Round / 局: {gameState.round_number}</span>
      </div>

      <div className="table-surface">
        {/* Center Wind Indicator */}
        <div className="center-wind">
          <div className="wind-char">{windMap[current_round_wind]}</div>
          <div className="wind-label">{current_round_wind}</div>
        </div>

        {/* Players */}
        {players.map((p) => (
          <div key={p.id} className={`player-seat seat-${p.seat_index}`}>
            <div className={`player-seat-number seat-num-${windNumberMap[p.current_wind] || 0}`}>
              {windNumberMap[p.current_wind] || '?'}
            </div>
            <div className="player-wind">{windMap[p.current_wind] || p.current_wind[0]}</div>
            <div className="player-name">{p.name}</div>
            <div className="player-score">Score: {p.score}</div>
          </div>
        ))}

        {/* Quick Reference Tables in corners (Optional, can be added later) */}
      </div>
    </div>
  );
}
