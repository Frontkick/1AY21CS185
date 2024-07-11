const axios = require('axios');

const authUrl = 'http://20.244.56.144/test/auth';


async function fetchBearerToken() {
    try {
        
        const requestBody = {
            companyName: 'AffordMed',
            clientID: '7356d7f6-2f62-4b4d-ad96-db0a6a544415',
            clientSecret: 'dHlZZJYEmYPYWViz',
            ownerName: 'Soumy',
            ownerEmail: 'jainsoumya7378@gmail.com',
            rollNo: '1AY21CS185'
        };

        
        const response = await axios.post(authUrl, requestBody);
        
        
        const accessToken = response.data.access_token;
        return accessToken;
        
    } catch (error) {
        console.error('Error fetching token:', error.message);
        throw error; 
    }
}

module.exports = fetchBearerToken;
