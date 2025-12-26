# Mahjong Scorekeeper & HUD

A full-stack application designed to manage Hong Kong Style Mahjong games. It features a shared "Heads Up Display" (HUD) for a large screen (TV/Monitor) and mobile-friendly views for individual players (Score reference, Rules, Admin controls).

## Features

*   **Main Display (HUD):** Shows the current round wind, player seats (automatically rotated), relative winds, and scores. Perfect for a TV connected to the host computer.
*   **Admin Panel:** Control the flow of the game.
    *   **Score Adjustment:** Add/Subtract points for any player.
    *   **Game Flow:** Rotate winds automatically based on whether the dealer won or lost.
    *   **Configuration:** Rename players, set minimum Faan (fan) requirements, and manually override winds.
    *   **Persistence:** Game state is saved automatically to a local database, so you can restart the server without losing progress.
*   **Player Guide:** A comprehensive reference table for Hong Kong Mahjong scoring (Faan values, English/Chinese names, pronunciations).
*   **Rules:** Basic instructions on how to play and turn structure.
*   **Local Multi-Device Support:** Players can connect to the server via their phones on the local network to view their own reference guides or control the game.

## Tech Stack

*   **Frontend:** React (Vite)
*   **Backend:** Node.js (Express)
*   **Database:** SQLite (Persistent file-based storage)

## Prerequisites

*   [Node.js](https://nodejs.org/) (v14 or higher recommended)
*   npm (usually comes with Node.js)

## Installation

1.  Clone the repository.
2.  Install dependencies for the root, server, and client:

```bash
npm install
npm run install-all
```

*(Note: `npm run install-all` is a helper script defined in `package.json` that installs dependencies in all subfolders)*

## Running the Application

To start both the Backend API and the Frontend Server simultaneously:

```bash
npm start
```

*   **Server:** Runs on `http://localhost:3001`
*   **Client:** Runs on `http://localhost:5173` (and `http://0.0.0.0:5173` for network access)

### Connecting from other devices
Find the local IP address of the host machine (e.g., `192.168.1.50`).
Players can open `http://192.168.1.50:5173` in their mobile browsers.

## Usage Guide

### 1. Main View (HUD) - `/`
Open this on the main shared screen. It displays:
*   Current Round Wind (Center)
*   Player Seats (mapped to physical locations: Bottom, Right, Top, Left)
*   Player Scores and Current Seat Winds.

### 2. Admin Panel - `/admin`
Use this to manage the game.
*   **Next Hand:**
    *   **Dealer Won / Draw:** Keeps the winds the same.
    *   **Dealer Lost:** Rotates the winds (Dealer moves to next player). If the dealer rotates back to the original starter, the Round Wind (East/South/etc) updates automatically.
*   **Scores:** Quick buttons to adjust scores.
*   **Settings:** Change player names or manually fix game state.

### 3. Guide & Rules - `/guide`, `/rules`
Reference materials for players.
