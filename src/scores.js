import axios from 'axios';

// Function to fetch scores for a specific position
export const getScoresByPosition = async (position) => {
    // Ensure position is valid
    const validPositions = ['QB', 'RB', 'WR', 'TE', 'K', 'DST'];  // Add valid positions as needed
    if (!validPositions.includes(position)) {
        console.warn(`Position ${position} is not valid. Skipping.`);
        return [];
    }

    const options = {
        method: 'GET',
        url: `https://fantasy-sports-nfl-nba-mlb-nhl.p.rapidapi.com/football/ppr/tp/${position}`,
        headers: {
            'x-rapidapi-key': '52470e3184msh7eac7a0d8767432p1f96b6jsn1ad7d0b19075',
            'x-rapidapi-host': 'fantasy-sports-nfl-nba-mlb-nhl.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(`Response for position ${position}:`, response.data);  // Log the raw response

        // Handle the response data based on its structure
        const scores = [];
        if (Array.isArray(response.data)) {
            response.data.forEach(playerObject => {
                Object.entries(playerObject).forEach(([playerName, stats]) => {
                    scores.push({
                        playerName,
                        score: parseFloat(stats.fantasyPts),  // Convert to number
                        position: stats.position
                    });
                });
            });
        } else {
            console.error(`Unexpected response structure for position ${position}`);
        }

        return scores;
    } catch (error) {
        console.error(`Error fetching scores for position ${position}:`, error);
        throw error;
    }
};

// Function to fetch scores for multiple positions
export const getScoresForPositions = async (positions) => {
    try {
        // Filter out invalid positions
        const validPositions = positions.filter(position => !['LB', 'DE'].includes(position));
        const scorePromises = validPositions.map(position => getScoresByPosition(position));
        const scores = await Promise.all(scorePromises);
        // Flatten the array of arrays into a single array
        return scores.flat();
    } catch (error) {
        console.error('Error fetching scores for positions:', error);
        throw error;
    }
};
