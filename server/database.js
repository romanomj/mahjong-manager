const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}
const dbPath = path.join(dbDir, 'mahjong.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Game State Table
    db.run(`CREATE TABLE IF NOT EXISTS game_state (
      id INTEGER PRIMARY KEY,
      current_round_wind TEXT DEFAULT 'East',
      min_faan INTEGER DEFAULT 3,
      round_number INTEGER DEFAULT 1,
      dealer_seat_index INTEGER DEFAULT 0,
      layout_rotation INTEGER DEFAULT 0,
      last_dice_roll TEXT,
      music_enabled INTEGER DEFAULT 0,
      lucky_blessings_enabled INTEGER DEFAULT 0,
      lucky_blessings_chance INTEGER DEFAULT 10,
      current_lucky_player_id INTEGER DEFAULT NULL,
      lucky_timestamp TEXT DEFAULT NULL
    )`, (err) => {
      if (err) console.error("Error creating game_state table:", err);
      else {
        // Insert default if not exists
        db.get("SELECT * FROM game_state WHERE id = 1", (err, row) => {
          if (!row) {
            db.run(`INSERT INTO game_state (id, current_round_wind, min_faan, round_number, dealer_seat_index, layout_rotation, last_dice_roll, music_enabled, lucky_blessings_enabled, lucky_blessings_chance, current_lucky_player_id, lucky_timestamp) VALUES (1, 'East', 3, 1, 0, 0, NULL, 0, 0, 10, NULL, NULL)`);
          } else {
            // Migration: Check if layout_rotation exists, if not add it
            if (row.layout_rotation === undefined) {
              db.run("ALTER TABLE game_state ADD COLUMN layout_rotation INTEGER DEFAULT 0", (err) => {
                if (err) console.error("Error adding layout_rotation column:", err);
              });
            }
            if (row.last_dice_roll === undefined) {
              db.run("ALTER TABLE game_state ADD COLUMN last_dice_roll TEXT", (err) => {
                if (err) console.error("Error adding last_dice_roll column:", err);
                else console.log("Added last_dice_roll column.");
              });
            }
            if (row.music_enabled === undefined) {
              db.run("ALTER TABLE game_state ADD COLUMN music_enabled INTEGER DEFAULT 0", (err) => {
                if (err) console.error("Error adding music_enabled column:", err);
                else console.log("Added music_enabled column.");
              });
            }
            // Lucky Blessings Migrations
            if (row.lucky_blessings_enabled === undefined) {
              db.run("ALTER TABLE game_state ADD COLUMN lucky_blessings_enabled INTEGER DEFAULT 0", (err) => {
                if (err) console.error("Error adding lucky_blessings_enabled column", err);
              });
            }
            if (row.lucky_blessings_chance === undefined) {
              db.run("ALTER TABLE game_state ADD COLUMN lucky_blessings_chance INTEGER DEFAULT 10", (err) => {
                if (err) console.error("Error adding lucky_blessings_chance column", err);
              });
            }
            if (row.current_lucky_player_id === undefined) {
              db.run("ALTER TABLE game_state ADD COLUMN current_lucky_player_id INTEGER DEFAULT NULL", (err) => {
                if (err) console.error("Error adding current_lucky_player_id column", err);
              });
            }
            if (row.lucky_timestamp === undefined) {
              db.run("ALTER TABLE game_state ADD COLUMN lucky_timestamp TEXT DEFAULT NULL", (err) => {
                if (err) console.error("Error adding lucky_timestamp column", err);
              });
            }
          }
        });
      }
    });

    // Players Table
    db.run(`CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      name TEXT,
      score INTEGER DEFAULT 0,
      seat_index INTEGER -- 0=East, 1=South, 2=West, 3=North (relative to dealer)
    )`, (err) => {
      if (err) console.error("Error creating players table:", err);
      else {
        // Check if players exist
        db.get("SELECT count(*) as count FROM players", (err, row) => {
          if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO players (id, name, score, seat_index) VALUES (?, ?, ?, ?)");
            stmt.run(1, 'Player 1', 0, 0);
            stmt.run(2, 'Player 2', 0, 1);
            stmt.run(3, 'Player 3', 0, 2);
            stmt.run(4, 'Player 4', 0, 3);
            stmt.finalize();
          }
        });
      }
    });
  });
}

module.exports = db;
