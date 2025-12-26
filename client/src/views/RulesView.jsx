import React from 'react';

export default function RulesView() {
  return (
    <div className="guide-container">
      <h2>How to Play / 游戏规则</h2>

      <div style={{ maxWidth: '800px' }}>
        <h3>Objective</h3>
        <p>
          The goal is to assemble a complete hand of 14 tiles (4 sets of 3 + 1 pair) before the other players.
        </p>

        <h3>Basic Turn Structure</h3>
        <ol>
          <li><strong>Draw:</strong> Pick a tile from the wall.</li>
          <li><strong>Action:</strong> You may declare a win (Self-Pick) or Kong.</li>
          <li><strong>Discard:</strong> Choose one tile to discard into the center.</li>
        </ol>

        <h3>Interactions</h3>
        <ul>
            <li><strong>Chow (Sheung):</strong> Take a discard from the player on your LEFT to complete a sequence (e.g., 2-3-4).</li>
            <li><strong>Pung (Pong):</strong> Take a discard from ANY player to complete a triplet (e.g., 9-9-9).</li>
            <li><strong>Kong (Gong):</strong> Take a discard or use a self-drawn tile to complete a quartet (4 of a kind). Draw a replacement tile.</li>
        </ul>

        <h3>Scoring (Faan)</h3>
        <p>
            This game uses a minimum point system (set by Admin). You cannot declare a win unless your hand value meets the minimum "Faan" (Faan/Points).
            See the "Scoring Guide" for a list of valid hands.
        </p>
      </div>
    </div>
  );
}
