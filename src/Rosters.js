// src/Rosters.js

import React, { useEffect, useState } from 'react';
import { getLeagueRosters, getLeagueUsers } from './api';  // Import the API functions
import players from './players.json';  // Import the players data from players.json

const Rosters = () => {
    const [rosters, setRosters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRostersAndUsers = async () => {
            try {
                const [rostersData, usersData] = await Promise.all([
                    getLeagueRosters(),
                    getLeagueUsers()
                ]);

                // Create a user map to match owner_id with user data (team_name and display_name)
                const userMap = {};
                usersData.forEach((user) => {
                    userMap[user.user_id] = {
                        team_name: user.metadata.team_name,
                        display_name: user.display_name
                    };
                });

                // Map roster starter player IDs to player objects in the players.json object
                const updatedRosters = rostersData.map((roster) => {
                    const updatedPlayers = roster.starters.map((playerId) => {
                        const originalScore = (Math.random() * 50).toFixed(2);  // Random score between 0 and 50
                        return players[playerId] || { id: playerId, full_name: "Unknown Player", originalScore, score: originalScore };  // Adding originalScore and score
                    });

                    return {
                        ...roster,
                        players: updatedPlayers,  // Replace starter IDs with player objects
                        team_name: userMap[roster.owner_id]?.team_name || 'Unknown Team',  // Match owner_id with user_id for team name
                        display_name: userMap[roster.owner_id]?.display_name || 'Unknown User'  // Match owner_id with user_id for display name
                    };
                });

                setRosters(updatedRosters);
            } catch (error) {
                setError('Failed to fetch rosters or users');
            } finally {
                setLoading(false);
            }
        };

        fetchRostersAndUsers();
    }, []);

    const handlePlayerClick = (teamId, playerId) => {
        console.log("Handle player click:");
        console.log("Received team ID:", teamId);
        console.log("Received player ID:", playerId);

        if (teamId === undefined || playerId === undefined) {
            console.error("Error: teamId or playerId is undefined");
            return;
        }

        setRosters(prevRosters => {
            console.log("Previous rosters:", JSON.parse(JSON.stringify(prevRosters)));

            return prevRosters.map(roster => {
                if (roster.team_id === teamId) {
                    console.log("Processing roster:", roster);

                    // Find the clicked player
                    const clickedPlayer = roster.players.find(player => player.id === playerId);
                    if (!clickedPlayer) {
                        console.error("Error: Clicked player not found in the roster");
                        return roster;
                    }

                    console.log("Clicked player details:", clickedPlayer);

                    // Check if the clicked player is already a captain
                    const isCurrentlyCaptain = clickedPlayer.isCaptain;
                    console.log("Is clicked player current captain:", isCurrentlyCaptain);

                    const updatedPlayers = roster.players.map(player => {
                        if (player.id === playerId) {
                            // Toggle captain status and update score for the clicked player
                            console.log("Updating clicked player:", player);

                            return {
                                ...player,
                                isCaptain: !isCurrentlyCaptain,
                                score: !isCurrentlyCaptain ? (player.originalScore * 2).toFixed(2) : player.originalScore
                            };
                        } else if (player.isCaptain) {
                            // Reset score and captain status for the previous captain
                            console.log("Resetting previous captain:", player);

                            return {
                                ...player,
                                isCaptain: false,
                                score: player.originalScore
                            };
                        }
                        return player;
                    });

                    console.log("Updated roster:", {
                        ...roster,
                        players: updatedPlayers
                    });

                    return {
                        ...roster,
                        players: updatedPlayers
                    };
                }
                return roster;
            });
        });
    };

    const handleScoreChange = (playerId, event) => {
        const newScore = parseFloat(event.target.value);
        if (isNaN(newScore)) return; // Ensure the input is a number

        setRosters(prevRosters =>
            prevRosters.map(roster => ({
                ...roster,
                players: roster.players.map(player =>
                    player.id === playerId
                        ? { ...player, score: newScore }
                        : player
                )
            }))
        );
    };

    if (loading) return <p>Loading rosters...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>League Rosters</h1>
            {rosters.map((roster, index) => (
                <div key={index}>
                    <h2>Team: {roster.team_name}</h2>
                    <p>Owner: {roster.display_name}</p>
                    <ul>
                        {roster.players.map((player) => (
                            <li key={player.id}>
                                <button onClick={() => handlePlayerClick(roster.team_id, player.id)}>
                                    {player.full_name} {player.isCaptain ? "(C)" : ""}
                                </button>
                                - {player.position ? `${player.position} for ${player.team}` : "Position Unknown"}
                                - {player.score}
                                <input
                                    type="number"
                                    value={player.score}
                                    onChange={(e) => handleScoreChange(player.id, e)}
                                    min="0"
                                    step="0.01"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Rosters;
