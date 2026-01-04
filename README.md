# <img src="client/public/images/mjman.png" width="64" alt="Mahjong Man Logo" /> Mahjong Man

**Mahjong Man** is a comprehensive full-stack application designed to manage Hong Kong Style Mahjong games. It features a shared "Heads Up Display" (HUD) for a large screen (TV/Monitor) and mobile-friendly views for individual players (Score reference, Rules, Admin controls).

## Features

*   **Main Display (HUD):**
    *   **Persistent Status:** Current Min Faan and Round Wind displayed prominently in the corners.
    *   **Live Game State:** Real-time updates for player scores, seat winds, and dealer status.
    *   **Visuals:** Automatic wind rotation and thematic styling.
*   **Admin Panel:**
    *   **Game Flow Control:** One-click "Next Hand" logic that handles wind rotation automatically (Dealer Won vs. Lost).
    *   **Score Management:** Easy addition/subtraction of points.
    *   **Lucky Blessings:** Configurable random events with video playback and persistent status effects.
    *   **Persistence:** SQLite database ensures game state survives restarts.
*   **Player Aids:**
    *   **Scoring Guide:** Complete reference for Faan values and hand patterns (English/Chinese).
    *   **Rules:** Detailed gameplay instructions.
    *   **Mobile Support:** Responsive design allows players to control the game or view guides from their phones.
*   **Deployment:** Dockerized with Nginx reverse proxy for production-ready serving on ports 80/443.

## Tech Stack

*   **Frontend:** React (Vite)
*   **Backend:** Node.js (Express)
*   **Database:** SQLite
*   **Infrastructure:** Docker, Docker Compose, Nginx

## Prerequisites

*   [Node.js](https://nodejs.org/) (v14+) & npm
*   [Docker Desktop](https://www.docker.com/) (for containerized deployment)

## Installation & Local Development

1.  Clone the repository.
2.  Install all dependencies:
    ```bash
    npm run install-all
    ```
3.  Start the development environment (Frontend + Backend):
    ```bash
    npm start
    ```
    *   **Server:** `http://localhost:3001`
    *   **Client:** `http://localhost:5173`

## Production Deployment (Docker)

The application includes a production-ready Docker setup using Nginx as a reverse proxy.

1.  Build and start the services:
    ```bash
    docker-compose up --build -d
    ```
2.  Access the application:
    *   **HTTP:** `http://localhost` (Port 80)
    *   **HTTPS:** `https://localhost` (Port 443 - requires cert configuration)

The Nginx proxy handles routing to the frontend files and proxies API requests (`/api`) to the backend service. Data is persisted in the `./data` volume.

## User Guide

### 1. Main HUD (`/`)
Designed for the main TV/Monitor.
*   **Layout:**
    *   **Top Left:** Minimum Faan requirement.
    *   **Top Right:** Current Round Wind (e.g., East, South).
    *   **Center:** Current active wind for the round.
    *   **Sides:** Player cards showing Name, Score, Seat Wind, and active effects (e.g., Lucky Blessing coin).

### 2. Admin Panel (`/admin`)
The control center for the game host.
*   **Next Hand:**
    *   *Dealer Won / Draw:* Advances the hand count but keeps positions.
    *   *Dealer Lost:* Rotates winds counter-clockwise. Updates Round Wind if the deal returns to the starter.
*   **Score Adjustment:** Buttons to add/subtract points.
*   **Settings:**
    *   *Players:* Rename players.
    *   *Game State:* Manually set winds or reset the entire game.
    *   *Lucky Blessings:* Toggle the feature, set trigger % (1-100), and enable/disable background music.

### 3. Scoring Guide (`/guide`)
A bilingual reference table for Hong Kong Mahjong scoring.
*   Lists all valid hands and their Faan values.
*   Includes descriptions and example imagery.

### 4. Rules (`/rules`)
*   Basic overview of gameplay flow (Drawing, Discarding, Pong/Kong/Chow).
*   Explanation of winning conditions.
