import Cookies from 'universal-cookie';
import constants from './constants.js';

module.exports = {
    cookies: new Cookies(), 
    getTuneupToken: () => {
        const token = localStorage.getItem(constants.TUNEUP_TOKEN_LOCAL_STORAGE_KEY);
        if (token) 
            return token;
        else 
            return null;
    }
};