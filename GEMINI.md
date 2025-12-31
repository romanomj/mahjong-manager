# Project Goals & Progress

## Goals
1.  **Interactive Scorekeeper:** Build a digital system to track scores and game state for Hong Kong Mahjong.
2.  **Shared HUD:** Create a visually distinct "Heads Up Display" for a central monitor.
3.  **Local Multiplayer:** Allow players to connect via personal devices (phones) to view rules and control the game without interfering with the main display.
4.  **Admin Control:** Provide a robust interface for manual score adjustments and game flow (wind rotation).
5.  **Persistence:** Ensure game state survives server restarts using SQLite.
6.  **Educational:** Include bilingual (English/Chinese) terminology and scoring guides to assist players learning the language and rules.

## Current Progress
*   **[Complete]** Project Structure (Client/Server Monorepo).
*   **[Complete]** Backend API (Node/Express) with SQLite integration.
*   **[Complete]** Frontend (React/Vite) with Polling for real-time updates.
*   **[Complete]** Views Implemented:
    *   Main Display (HUD)
    *   Admin Panel
    *   Scoring Guide
    *   Rules Page
*   **[Complete]** Game Logic:
    *   Automatic Wind Rotation (Seat & Round winds).
    *   Dealer tracking.
    *   Score calculation (Manual input).
    *   **Lucky Blessings:** Configurable random events with video playback and persistent player highlights.
*   **[Complete]** Network Configuration (Vite Proxy & Host binding).
*   **[Complete]** Deployment:
    *   Dockerfile and Docker Compose configuration.
    *   Environment persistence setup.

## Future Improvements / To-Do
*   **Images:** Add actual tile images to `assets/hand_images/` for the Scoring Guide.
*   **Visual Polish:** Enhance the HUD with better animations or thematic assets.
*   **Advanced Scoring:** Implement a calculator where users select tiles to calculate Faan automatically.
*   **Player History:** Track statistics across multiple games (Who won the most hands, etc.).
