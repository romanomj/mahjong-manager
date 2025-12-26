const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mahjong.db');

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
      dealer_seat_index INTEGER DEFAULT 0
    )`, (err) => {
        if (err) console.error("Error creating game_state table:", err);
        else {
             // Insert default if not exists
             db.get("SELECT * FROM game_state WHERE id = 1", (err, row) => {
                if (!row) {
                    db.run(`INSERT INTO game_state (id, current_round_wind, min_faan, round_number, dealer_seat_index) VALUES (1, 'East', 3, 1, 0)`);
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
