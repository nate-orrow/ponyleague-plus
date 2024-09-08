import React, { useEffect, useState } from 'react';
import { getLeagueRosters, getLeagueUsers } from './api';  // Import the API functions
import { getScoresForPositions } from './scores';  // Import the function from scores.js
import players from './players.json';  // Import the players data from players.json

const Rosters = () => {
    const [rosters, setRosters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRostersAndScores = async () => {
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

                // Get all unique player positions from the rosters
                const positions = [...new Set(
                    rostersData.flatMap(roster =>
                        roster.starters.map(playerId => players[playerId]?.position)
                    )
                )].filter(position => position);

                // Fetch scores for all positions
                const scoresData = await getScoresForPositions(positions);

                // Map roster starter player IDs to player objects and their scores
                const updatedRosters = rostersData.map((roster) => {
                    const updatedPlayers = roster.starters.map((playerId) => {
                        const player = players[playerId] || { id: playerId, full_name: "Unknown Player", position: "Unknown" };
                        const playerScore = scoresData.find(score => score.playerName === player.full_name && score.position === player.position)?.score || 0;
                        return {
                            ...player,
                            score: playerScore
                        };
                    });

                    return {
                        ...roster,
                        players: updatedPlayers,  // Replace starter IDs with player objects and their scores
                        team_name: userMap[roster.owner_id]?.team_name || 'Unknown Team',  // Match owner_id with user_id for team name
                        display_name: userMap[roster.owner_id]?.display_name || 'Unknown User'  // Match owner_id with user_id for display name
                    };
                });

                setRosters(updatedRosters);
            } catch (error) {
                setError('Failed to fetch rosters or scores');
            } finally {
                setLoading(false);
            }
        };

        fetchRostersAndScores();
    }, []);

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
                                {player.position} - {player.full_name} - {player.score}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Rosters;
