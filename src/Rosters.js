// src/Rosters.js

import React, { useEffect, useState } from 'react';
import { getLeagueRosters } from './api';  // Import the API call for fetching rosters
import players from './players.json';  // Import players from the JSON file

const Rosters = () => {
    const [rosters, setRosters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRosters = async () => {
            try {
                const data = await getLeagueRosters();  // Fetch rosters from the API

                // Map roster player IDs to full player objects from players.json
                const updatedRosters = data.map((roster) => {
                    const updatedPlayers = roster.players.map((playerId) => {
                        return players.find((player) => player.id === playerId) || { id: playerId, name: "Unknown Player" };
                    });
                    return {
                        ...roster,
                        players: updatedPlayers  // Replace player IDs with player objects
                    };
                });

                setRosters(updatedRosters);
            } catch (error) {
                setError('Failed to fetch rosters');
            } finally {
                setLoading(false);
            }
        };

        fetchRosters();
    }, []);

    if (loading) return <p>Loading rosters...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>League Rosters</h1>
            {rosters.map((roster, index) => (
                <div key={index}>
                    <h2>Team: {roster.team_name}</h2>
                    <ul>
                        {roster.players.map((player) => (
                            <li key={player.id}>
                                {player.name} - {player.position ? `${player.position} for ${player.team}` : "Position Unknown"}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Rosters;
