import React from 'react';
import { useGameState } from '../hooks/useGameState';
import Wall from '../components/Wall';

export default function MainDisplay() {
  const { gameState, loading, error } = useGameState();

  // Debug Version Log
  React.useEffect(() => {
    console.log("App Version: 1.0.1 - Volume Fix Applied");
  }, []);

  // Players - derived if available
  const players = gameState ? gameState.players : [];


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

  // Music Player Logic
  const [playlist, setPlaylist] = React.useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);
  const audioRef = React.useRef(null);

  // Ref to track processed roll timestamps to avoid re-triggering on refresh
  const lastProcessedRollRef = React.useRef(0);
  const hasInitializedRef = React.useRef(false);

  const startDiceAnimation = (rollData) => {
    // 1. Countdown
    let count = 3;
    setDiceState({
      status: 'COUNTDOWN',
      countdownVal: count,
      rollValues: [],
      total: 0,
      targetPlayer: null
    });

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setDiceState(prev => ({ ...prev, countdownVal: count }));
      } else {
        clearInterval(timer);

        // 2. Rolling
        setDiceState(prev => ({ ...prev, status: 'ROLLING' }));

        setTimeout(() => {
          // 3. Result
          const total = rollData.total;
          // Calculate Target Player based on total (1=E, 2=S, 3=W, 4=N)
          const targetWindNumber = (total % 4 === 0 ? 4 : (total % 4));
          const target = players.find(p => {
            const pWindNum = windNumberMap[p.current_wind] || 0;
            return pWindNum === targetWindNumber;
          });

          setDiceState({
            status: 'RESULT',
            rollValues: rollData.values,
            total: total,
            targetPlayer: target
          });

          // 4. Idle after delay
          setTimeout(() => {
            setDiceState(prev => ({ ...prev, status: 'IDLE' }));
          }, 8000);

        }, 2000);
      }
    }, 1000);
  };

  React.useEffect(() => {
    // Wait for gameState to be loaded
    if (!gameState) return;

    // First load logic: Sync ref but do not animate
    if (!hasInitializedRef.current) {
      if (gameState.last_dice_roll) {
        try {
          const rollData = JSON.parse(gameState.last_dice_roll);
          lastProcessedRollRef.current = rollData.timestamp;
        } catch (e) {
          console.error("Error parsing initial roll", e);
        }
      }
      hasInitializedRef.current = true;
      return;
    }

    // Subsequent updates logic: Animate if new timestamp
    if (gameState.last_dice_roll) {
      try {
        const rollData = JSON.parse(gameState.last_dice_roll);

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

  // Shuffle Function
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  // Fetch playlist on mount
  React.useEffect(() => {
    fetch('/api/music/list')
      .then(res => res.json())
      .then(files => {
        if (files && files.length > 0) {
          // Shuffle initially
          const shuffled = shuffleArray([...files]);
          setPlaylist(shuffled);
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

  // Lucky Blessings State
  const [luckyState, setLuckyState] = React.useState({
    status: 'IDLE', // IDLE, PREPARING_VIDEO, PLAYING_VIDEO, SHOW_DIALOG
    luckyPlayer: null
  });
  const videoRef = React.useRef(null);
  const lastLuckyTimestampRef = React.useRef(null);

  React.useEffect(() => {
    if (gameState && gameState.lucky_timestamp) {
      if (lastLuckyTimestampRef.current === null) {
        // First load sanity check: sync timestamp but do NOT trigger animation
        // to prevent re-playing old events on refresh
        lastLuckyTimestampRef.current = gameState.lucky_timestamp;
        return;
      }

      if (lastLuckyTimestampRef.current !== gameState.lucky_timestamp) {
        lastLuckyTimestampRef.current = gameState.lucky_timestamp;

        // Find lucky player
        const p = players.find(p => p.id === gameState.current_lucky_player_id);
        if (p) {
          // Trigger preparation phase
          setLuckyState({ status: 'PREPARING_VIDEO', luckyPlayer: p });
        }
      }
    }
  }, [gameState, players]);

  // Handle Video Trigger (PREPARING -> PLAYING)
  React.useEffect(() => {
    if (luckyState.status === 'PREPARING_VIDEO' && videoRef.current) {
      console.log("Preparing video playback...");
      const video = videoRef.current;
      video.currentTime = 0;
      video.muted = false;

      const attemptPlay = async () => {
        try {
          await video.play();
          // We don't set status here immediately; we wait for onPlaying event
          // to ensure frames are actually moving before showing it.
          console.log("Video play request sent");
        } catch (e) {
          console.error("Video play error", e);
          // If play fails, we might want to skip to dialog
          handleVideoEnded();
        }
      };
      attemptPlay();
    }
  }, [luckyState.status]);

  // Video Warmup Effect
  React.useEffect(() => {
    // Warmup video on mount to prevent freeze on first play
    const warmupVideo = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.muted = true;
          // Just play a tiny bit then pause
          await videoRef.current.play();

          setTimeout(() => {
             if (videoRef.current) {
               videoRef.current.pause();
               videoRef.current.currentTime = 0;
               videoRef.current.muted = false; // Unmute for actual playback
               console.log("Video warmup complete");
             }
          }, 50); // Let it play for 50ms to ensure buffers are filled

        } catch (e) {
          console.log("Video warmup skipped (autoplay restriction?)", e);
        }
      }
    };
    warmupVideo();
  }, []);

  // Ref to track dialog timeout so we can clear it on manual skip
  const dialogTimeoutRef = React.useRef(null);

  const handleVideoEnded = () => {
    // If video is still playing, force pause
    if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
    }

    setLuckyState(prev => ({ ...prev, status: 'SHOW_DIALOG' }));

    if (dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current);

    dialogTimeoutRef.current = setTimeout(() => {
      setLuckyState({ status: 'IDLE', luckyPlayer: null });
    }, 5000);
  };

  const onVideoPlaying = () => {
     if (luckyState.status === 'PREPARING_VIDEO') {
         console.log("Video actually playing, showing now.");
         setLuckyState(prev => ({ ...prev, status: 'PLAYING_VIDEO' }));
     }
  };

  const handleOverlayClick = () => {
    if (luckyState.status === 'PLAYING_VIDEO' || luckyState.status === 'PREPARING_VIDEO') {
      // Skip video -> Show Dialog
      handleVideoEnded();
    } else if (luckyState.status === 'SHOW_DIALOG') {
      // Skip dialog -> Close immediately
      if (dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current);
      setLuckyState({ status: 'IDLE', luckyPlayer: null });
    }
  };

  if (loading) return <div className="screen">Loading...</div>;
  if (error) return <div className="screen">Error loading game state. Is server running?</div>;
  if (!gameState) return <div className="screen">No game state found.</div>;

  const { current_round_wind, min_faan } = gameState;

  return (
    <div className="hud-container">
      {/* Audio Element */}
      {playlist.length > 0 && (
        <audio
          ref={audioRef}
          src={`/media/${encodeURIComponent(playlist[currentTrackIndex])}`}
          onEnded={nextTrack}
          loop={playlist.length === 1}
        />
      )}

      {/* Media Controls */}
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

      {/* Persistent Video Element for Preloading */}
      {/* Moved out of conditional render to prevent "cold start" freeze on RPi */}
      <video
        ref={videoRef}
        src="/video/lucky.mp4"
        preload="auto"
        playsInline
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxHeight: '80vh',
          borderRadius: '20px',
          boxShadow: '0 0 50px gold',
          zIndex: 9001, // Above overlay
          visibility: 'visible', // Keep visible in layout to maintain composition
          opacity: luckyState.status === 'PLAYING_VIDEO' ? 1 : 0,
          pointerEvents: luckyState.status === 'PLAYING_VIDEO' ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
        onPlaying={onVideoPlaying}
        onEnded={(e) => {
          e.stopPropagation();
          handleVideoEnded();
        }}
      // Removed autoPlay, we trigger play() in useEffect
      />

      {/* Lucky Blessings Overlay (Background & Dialog) */}
      {luckyState.status !== 'IDLE' && (
        <div
          className="lucky-overlay"
          onClick={handleOverlayClick}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 9000, background: 'rgba(0,0,0,0.8)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          {/* Video is now rendered outside to persist */}

          {luckyState.status === 'SHOW_DIALOG' && luckyState.luckyPlayer && (
            <div className="lucky-dialog" style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              padding: '40px', borderRadius: '20px', textAlign: 'center',
              boxShadow: '0 0 30px #FF4500', color: '#8B0000', fontSize: '2rem', fontWeight: 'bold'
            }}>
              <p>{luckyState.luckyPlayer.name} has been blessed with extra luck this round!</p>
              <p style={{ fontSize: '2.5rem', marginTop: '20px' }}>{luckyState.luckyPlayer.name} 本局鸿运当头！</p>
              <p style={{ fontSize: '1rem', marginTop: '30px', opacity: 0.8 }}>(Click to dismiss)</p>
            </div>
          )}
        </div>
      )}

      <div className="hud-corner-box top-left">
        <div className="corner-label">Min Points / 最小番数</div>
        <div className="corner-value">{min_faan}</div>
      </div>

      <div className="hud-corner-box top-right">
        <div className="corner-label">Round / 局</div>
        <div className="corner-value">{gameState.round_number}</div>
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
                  <div>Start with {['北', '東', '南', '西'][diceState.total % 4]} seat.</div>
                  {diceState.targetPlayer && (
                    <div className="dice-player-name">{diceState.targetPlayer.name}</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Walls */}
        {(() => {
          let activeSide = null;
          let highlightIndex = null;

          // PERSISTENT HIGHLIGHT LOGIC: Use gameState.last_dice_roll directly
          // Only show if animation is NOT active (IDLE or RESULT)
          // If we are in RESULT, we show it. If IDLE, we show it (persistent).
          // If COUNTDOWN or ROLLING, we hide it to let animation play.
          if (gameState.last_dice_roll && diceState.status !== 'COUNTDOWN' && diceState.status !== 'ROLLING') {
            try {
              const rollData = JSON.parse(gameState.last_dice_roll);
              const total = rollData.total;

              // Calculate Target Player based on total (1=E, 2=S, 3=W, 4=N)
              const targetWindNumber = (total % 4 === 0 ? 4 : (total % 4));
              const targetPlayer = players.find(p => {
                const pWindNum = windNumberMap[p.current_wind] || 0;
                return pWindNum === targetWindNumber;
              });

              if (targetPlayer) {
                const rotation = gameState.layout_rotation || 0;
                // visualSeatIndex: 0=Bottom, 1=Right, 2=Top, 3=Left
                const visualSeatIndex = (targetPlayer.seat_index + rotation + 4) % 4;

                const sideMap = { 0: 'bottom', 1: 'right', 2: 'top', 3: 'left' };
                activeSide = sideMap[visualSeatIndex];
                highlightIndex = (total - 1) % 18;
              }
            } catch (e) {
              console.error("Error parsing roll data for walls", e);
            }
          }

          return (
            <>
              <Wall side="top" highlightIndex={activeSide === 'top' ? highlightIndex : null} showDraw={activeSide === 'top'} />
              <Wall side="bottom" highlightIndex={activeSide === 'bottom' ? highlightIndex : null} showDraw={activeSide === 'bottom'} />
              <Wall side="left" highlightIndex={activeSide === 'left' ? highlightIndex : null} showDraw={activeSide === 'left'} />
              <Wall side="right" highlightIndex={activeSide === 'right' ? highlightIndex : null} showDraw={activeSide === 'right'} />
            </>
          );
        })()}

        {/* Center Wind Indicator */}
        <div className="center-wind">
          <div className="wind-char">{windMap[current_round_wind]}</div>
          <div className="wind-label">{current_round_wind}</div>
        </div>

        {/* Players */}
        {gameState.players.map((player) => {
          const rotation = gameState.layout_rotation || 0;
          const visualSeatIndex = (player.seat_index + rotation + 4) % 4;
          const isLucky = gameState.current_lucky_player_id === player.id;

          return (
            <div
              key={player.id}
              className={`player-seat seat-${visualSeatIndex}`}
              style={isLucky ? { border: '4px solid gold', boxShadow: '0 0 20px gold' } : {}}
            >
              {isLucky && (
                <img
                  src="/images/lucky_coin.png"
                  alt="Lucky"
                  style={{
                    position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
                    width: '50px', zIndex: 50
                  }}
                />
              )}
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
        })}
      </div>
    </div>
  );
}
