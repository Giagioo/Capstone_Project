import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // Applica il token a tutte le richieste Axios
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Rimuove il token dalle intestazioni
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
