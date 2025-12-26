import { useState, useEffect } from 'react';
import axios from 'axios';

// Polling interval in milliseconds
const POLL_INTERVAL = 2000;

export function useGameState() {
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchState = async () => {
        try {
            // Use relative path so it works via Vite proxy
            const response = await axios.get('/api/gamestate');
            setGameState(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching game state:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchState(); // Initial fetch
        const intervalId = setInterval(fetchState, POLL_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);

    return { gameState, loading, error, refresh: fetchState };
}
