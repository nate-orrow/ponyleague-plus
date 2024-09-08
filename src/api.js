// src/api.js

import axios from 'axios';

const API_BASE_URL = 'https://api.sleeper.app/v1'; // sleeper api base url
const LEAGUE_ID = '1124849809983819776'; // Hardcoded league ID

// -- GET USER DATA ----------------------------------------------------------------------------------------------------
export const getLeagueUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/league/${LEAGUE_ID}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching league users:', error);
        throw error;
    }
};

// -- GET ROSTER DATA --------------------------------------------------------------------------------------------------
export const getLeagueRosters = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/league/${LEAGUE_ID}/rosters`);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error fetching league rosters:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
        throw error;
    }
};