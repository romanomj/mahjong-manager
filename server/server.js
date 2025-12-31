const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Helper to get winds based on dealer index
const WINDS = ['East', 'South', 'West', 'North']; // 0, 1, 2, 3

// GET /api/music/list
app.get('/api/music/list', (req, res) => {
    const musicDir = path.join(__dirname, 'public/music');
    const fs = require('fs');
    fs.readdir(musicDir, (err, files) => {
        if (err) {
            // If directory doesn't exist, return empty
            if (err.code === 'ENOENT') return res.json([]);
            return res.status(500).json({ error: err.message });
        }
        // Filter for mp3/wav/ogg
        const audioFiles = files.filter(f => /\.(mp3|wav|ogg)$/i.test(f));
        res.json(audioFiles);
    });
});


// GET /api/gamestate
app.get('/api/gamestate', (req, res) => {
    const stateQuery = "SELECT * FROM game_state WHERE id = 1";
    const playersQuery = "SELECT * FROM players ORDER BY seat_index ASC"; // This ordering might need adjustment based on fixed seats vs rotating winds, but for now let's just get them.

    db.get(stateQuery, [], (err, state) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(playersQuery, [], (err, players) => {
            if (err) return res.status(500).json({ error: err.message });

            // Calculate actual wind for each player based on dealer position?
            // Actually, usually seats are fixed physically, but the wind assignment rotates.
            // Let's assume seat_index 0 is the physical "seat 1".
            // If dealer_seat_index is 0, then seat 0 is East.
            // If dealer_seat_index is 1, then seat 1 is East.
            // So Player at seat S has wind: WINDS[(S - dealer_seat_index + 4) % 4] ??
            // Wait. In HK MJ:
            // Winds are: East, South, West, North.
            // Turn order is CCW.
            // If Dealer is at Seat 0. Seat 0 is East. Seat 1 is South. Seat 2 is West. Seat 3 is North.
            // If Dealer rotates to Seat 1. Seat 1 is East. Seat 2 is South. Seat 3 is West. Seat 0 is North.
            // Formula: Wind_Index = (Seat_Index - Dealer_Seat_Index + 4) % 4

            const enrichedPlayers = players.map(p => {
                const windIndex = (p.seat_index - state.dealer_seat_index + 4) % 4;
                return {
                    ...p,
                    current_wind: WINDS[windIndex]
                };
            });

            res.json({
                ...state,
                players: enrichedPlayers
            });
        });
    });
});

// POST /api/admin/update-score
app.post('/api/admin/update-score', (req, res) => {
    const { playerId, delta } = req.body; // delta can be positive or negative
    db.run("UPDATE players SET score = score + ? WHERE id = ?", [delta, playerId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// POST /api/admin/config
app.post('/api/admin/config', (req, res) => {
    const { min_faan, player_names, dealer_seat_override, current_round_wind } = req.body;

    // Update Min Faan / Round Wind
    if (min_faan !== undefined || current_round_wind !== undefined || dealer_seat_override !== undefined) {
        let updates = [];
        let params = [];
        if (min_faan !== undefined) { updates.push("min_faan = ?"); params.push(min_faan); }
        if (current_round_wind !== undefined) { updates.push("current_round_wind = ?"); params.push(current_round_wind); }
        if (dealer_seat_override !== undefined) { updates.push("dealer_seat_index = ?"); params.push(dealer_seat_override); }

        if (updates.length > 0) {
            db.run(`UPDATE game_state SET ${updates.join(", ")} WHERE id = 1`, params, (err) => {
                if (err) console.error(err);
            });
        }
    }

    // Update Player Names
    if (player_names && Array.isArray(player_names)) {
        // Expecting [{id: 1, name: "Bob"}, ...]
        const stmt = db.prepare("UPDATE players SET name = ? WHERE id = ?");
        player_names.forEach(p => {
            stmt.run(p.name, p.id);
        });
        stmt.finalize();
    }

    res.json({ success: true });
});

// POST /api/admin/next-hand
app.post('/api/admin/next-hand', (req, res) => {
    const { dealer_won } = req.body; // boolean

    db.get("SELECT * FROM game_state WHERE id = 1", (err, state) => {
        if (err) return res.status(500).json({ error: err.message });

        let newRoundNumber = (state.round_number || 0) + 1;

        if (dealer_won) {
            // Dealer stays, no rotation.
            // Increment round number.
            db.run("UPDATE game_state SET round_number = ? WHERE id = 1", [newRoundNumber], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, message: "Dealer stays. Round updated." });
            });
        } else {
            // Dealer rotates to next seat (CCW: 0 -> 1 -> 2 -> 3 -> 0)
            let newDealerIndex = (state.dealer_seat_index + 1) % 4;
            let newRoundWind = state.current_round_wind;

            // If we cycle back to the original starter, normally the Round Wind changes.
            if (newDealerIndex === 0) {
                const windOrder = ['East', 'South', 'West', 'North'];
                const currentWindIdx = windOrder.indexOf(state.current_round_wind);
                const nextWindIdx = (currentWindIdx + 1) % 4;
                newRoundWind = windOrder[nextWindIdx];
            }

            db.run("UPDATE game_state SET dealer_seat_index = ?, current_round_wind = ?, round_number = ? WHERE id = 1",
                [newDealerIndex, newRoundWind, newRoundNumber],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ success: true, message: "Dealer rotated. Round updated." });
                });
        }
    });
});

// POST /api/admin/update-rotation
app.post('/api/admin/update-rotation', (req, res) => {
    const { rotation } = req.body;
    db.run("UPDATE game_state SET layout_rotation = ? WHERE id = 1", [rotation], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// POST /api/admin/roll-dice
app.post('/api/admin/roll-dice', (req, res) => {
    // Generate 3 dice (1-6)
    const dice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
    ];
    const total = dice.reduce((a, b) => a + b, 0);
    const rollData = JSON.stringify({
        timestamp: Date.now(),
        values: dice,
        total: total
    });

    db.run("UPDATE game_state SET last_dice_roll = ? WHERE id = 1", [rollData], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, dice, total });
    });
});

// POST /api/admin/toggle-music
app.post('/api/admin/toggle-music', (req, res) => {
    const { enabled } = req.body; // boolean
    db.run("UPDATE game_state SET music_enabled = ? WHERE id = 1", [enabled ? 1 : 0], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});


// POST /api/admin/reset
app.post('/api/admin/reset', (req, res) => {
    db.serialize(() => {
        db.run("UPDATE game_state SET current_round_wind = 'East', min_faan = 3, dealer_seat_index = 0, round_number = 1, layout_rotation = 0 WHERE id = 1", (err) => {
            if (err) {
                console.error("Error resetting game state:", err);
            }
        });
        db.run("UPDATE players SET score = 0", (err) => {
            if (err) {
                console.error("Error resetting players:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true });
        });
    });
});


// Serve static files (music)
const path = require('path');
app.use('/media', express.static(path.join(__dirname, 'public/music')));

// Serve React App in Production
// In Docker, we copy client/dist to /app/client_dist
app.use(express.static(path.join(__dirname, 'client_dist')));

// ... API Routes ...
// (Keep existing API routes above this)

// Catch-all for React Router (must be after API routes)
// Express 5+ / path-to-regexp 6+ requires explicit regex for wildcards
app.get(/(.*)/, (req, res) => {
    // Determine if we are looking for an API route that didn't match
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Not Found' });
    }
    res.sendFile(path.join(__dirname, 'client_dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
