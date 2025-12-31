import React from 'react';
import { useGameState } from '../hooks/useGameState';

export default function MainDisplay() {
  const { gameState, loading, error } = useGameState();

  // Map winds to Chinese (Traditional)
  const windMap = { 'East': '東', 'South': '南', 'West': '西', 'North': '北' };

  // Map winds to Numbers
  const windNumberMap = { 'East': 1, 'South': 2, 'West': 3, 'North': 4 };

  // Dice Animation State
  const [diceState, setDiceState] = React.useState({
    status: 'IDLE', // IDLE, COUNTDOWN, ROLLING, RESULT
    countdownVal: 3,
    rollValues: [], // [1, 2, 3]
    total: 0,
    targetPlayer: null
  });

  // Ref to track processed roll timestamps to avoid re-triggering on refresh
  const lastProcessedRollRef = React.useRef(0);

  // Music Player Logic - MOVED TO TOP to avoid Hook Errors
  const [playlist, setPlaylist] = React.useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);
  const audioRef = React.useRef(null);

  // Players - derived if available
  const players = gameState ? gameState.players : [];

  const startDiceAnimation = (rollData) => {
    // 1. Countdown
    setDiceState({ status: 'COUNTDOWN', countdownVal: 3, rollValues: [], total: 0, targetPlayer: null });

    let count = 3;
    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setDiceState(prev => ({ ...prev, countdownVal: count }));
      } else {
        clearInterval(countInterval);
        // 2. Rolling
        setDiceState(prev => ({ ...prev, status: 'ROLLING' }));
        setTimeout(() => {
          // 3. Result
          const total = rollData.total;

          // Target Seat logic based on User Request:
          // "Relative to the current round... map to the current player's number shown in their top left hand corner."
          // The number in top-left is `windNumberMap[player.current_wind]`.
          // 1=East, 2=South, 3=West, 4=North.
          // The dice formula is: 1 = East, 2 = South, 3 = West, 0 = North (4).
          // So (total % 4) maps to the Wind Number directly (with 0 becoming 4).
          const targetWindNumber = (total % 4 === 0 ? 4 : (total % 4));

          // Find the player who HAS this current wind number.
          // We need to look at `players` and their `current_wind` property.
          // We can reuse `windNumberMap` to find the match.

          const targetP = players.find(p => {
            const pWindNum = windNumberMap[p.current_wind] || 0;
            return pWindNum === targetWindNumber;
          });

          setDiceState({
            status: 'RESULT',
            countdownVal: 0,
            rollValues: rollData.values,
            total: rollData.total,
            targetPlayer: targetP
          });

          // Clear after 5 seconds
          setTimeout(() => {
            setDiceState(prev => ({ ...prev, status: 'IDLE' }));
          }, 5000);
        }, 2000); // Roll for 2 seconds
      }
    }, 1000);
  };

  React.useEffect(() => {
    if (gameState && gameState.last_dice_roll) {
      try {
        const rollData = JSON.parse(gameState.last_dice_roll);

        // Initial load: sync ref but do NOT animate
        if (lastProcessedRollRef.current === 0) {
          lastProcessedRollRef.current = rollData.timestamp;
          return;
        }

        // New roll detected
        if (rollData.timestamp > lastProcessedRollRef.current) {
          lastProcessedRollRef.current = rollData.timestamp;
          // Trigger Animation
          startDiceAnimation(rollData);
        }
      } catch (e) {
        console.error("Error parsing roll data", e);
      }
    }
  }, [gameState]);




  // Music Player Logic - Hooks moved to top

  // Fetch playlist on mount
  React.useEffect(() => {
    fetch('/api/music/list')
      .then(res => res.json())
      .then(files => {
        if (files && files.length > 0) {
          setPlaylist(files);
        }
      })
      .catch(err => console.error("Error fetching music:", err));
  }, []);

  // Handle music_enabled change
  React.useEffect(() => {
    if (gameState && audioRef.current) {
      if (!gameState.music_enabled) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Check if we should auto-play or just allow user to play?
        // "enable/disable background music" - usually implies Master Switch.
        // If enabled, we don't necessarily FORCE play, but we allow it.
        // However, if we were playing and got disabled, we stopped.
        // If we get enabled again, maybe we don't auto-start. User can use controls.
      }
    }
  }, [gameState ? gameState.music_enabled : false]);

  // Handle volume
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Play error:", e));
      setIsPlaying(true);
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    // Auto-play next if was playing or just changing track?
    // Usually next implies play.
    // Need to wait for rendering new src? React handles source change.
    // We'll trust the effect of src change or just force play in a timeout.
    setTimeout(() => {
      if (isPlaying && audioRef.current) audioRef.current.play();
    }, 100);
  };

  if (loading) return <div className="screen">Loading...</div>;
  if (error) return <div className="screen">Error loading game state. Is server running?</div>;
  if (!gameState) return <div className="screen">No game state found.</div>;

  const { current_round_wind, min_faan } = gameState;

  return (
    <div className="hud-container">
      {/* Audio Element - Always render if playlist ready, hooks handled above */}
      {playlist.length > 0 && (
        <audio
          ref={audioRef}
          src={`http://localhost:3001/media/${playlist[currentTrackIndex]}`}
          onEnded={nextTrack}
          loop={playlist.length === 1}
        />
      )}


      {/* Media Controls (Only if Music Enabled) */}
      {gameState && gameState.music_enabled && (
        <div className="media-player-controls minimal-controls">
          <div className="controls-row">
            <button onClick={togglePlay} className="control-btn">{isPlaying ? '❚❚' : '▶'}</button>
            <input
              type="range" min="0" max="1" step="0.05"
              value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="hud-info-bar">
        <span>Min Points / 最小番数: {min_faan}</span>
        <span>Round / 局: {gameState.round_number}</span>
      </div>

      <div className="table-surface">
        {/* Dice Overlay */}
        {diceState.status !== 'IDLE' && (
          <div className="dice-overlay">
            {diceState.status === 'COUNTDOWN' && (
              <div className="dice-countdown">
                Rolling in / 掷骰子 <br /> {diceState.countdownVal}...
              </div>
            )}
            {diceState.status === 'ROLLING' && (
              <div className="dice-rolling-container">
                <div className="die die-rolling">?</div>
                <div className="die die-rolling">?</div>
                <div className="die die-rolling">?</div>
              </div>
            )}
            {diceState.status === 'RESULT' && (
              <>
                <div className="dice-rolling-container">
                  {diceState.rollValues.map((val, idx) => (
                    <div key={idx} className="die">{val}</div>
                  ))}
                </div>
                <div className="dice-result-info">
                  <div>Total: {diceState.total}</div>
                  <div>Starts At: Seat {(diceState.total % 4 === 0 ? 4 : diceState.total % 4)}</div>
                  {diceState.targetPlayer && (
                    <div className="dice-player-name">{diceState.targetPlayer.name}</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Center Wind Indicator */}
        <div className="center-wind">
          <div className="wind-char">{windMap[current_round_wind]}</div>
          <div className="wind-label">{current_round_wind}</div>
        </div>

        {/* Players */}
        {gameState.players.map((player) => {
          // Calculate visual position based on rotation
          // layout_rotation: 0 = default, 1 = rotated 1 spot CCW (or similar, depending on preference)
          // Original Logic: seat-0 is bottom, seat-1 right, seat-2 top, seat-3 left
          // If we want to "rotate display clockwise", we might mean shifting P1 from Bottom -> Left (CW rotation of table means seats move CW?)
          // Let's stick to the math: visualIndex = (seatIndex + rotation) % 4
          // If rotation is positive, seat 0 becomes seat 1 (Right).
          const rotation = gameState.layout_rotation || 0;
          // Ensure positive result for modulo
          const visualSeatIndex = (player.seat_index + rotation + 4) % 4;

          return (
            <div key={player.id} className={`player-seat seat-${visualSeatIndex}`}>
              <div className={`player-seat-number seat-num-${windNumberMap[player.current_wind] || 0}`}>
                {windNumberMap[player.current_wind] || '?'}
              </div>
              <div className="player-wind">{windMap[player.current_wind] || player.current_wind[0]}</div>
              <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-score">Score: {player.score}</div>
              </div>
            </div>
          );
        })}  {/* Quick Reference Tables in corners (Optional, can be added later) */}
      </div>
    </div>
  );
}
