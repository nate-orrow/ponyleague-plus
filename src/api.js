// src/api.js

import axios from 'axios';

const API_BASE_URL = 'https://api.sleeper.app/v1'; // sleeper api base url
const ROSTER_EXT = '/rosters'; // get league rosters
const PLAYERS_EXT = '/players/nfl'; // get all players
const LEAGUE_ID = '1124849809983819776'; // Hardcoded league ID

// -- GET ROSTER DATA --------------------------------------------------------------------------------------------------
export const getLeagueRosters = async () => {
    try {
        const response = await axios.get( `${ API_BASE_URL }/league/${ LEAGUE_ID }/rosters` );
        console.log( response );
        return response.data;
    } catch ( error ) {
        console.error( 'Error fetching league rosters:', error );
        throw error;
    }
};