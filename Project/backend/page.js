const express = require('express');
const axios = require('axios');
const app = express();

const BASE_API_URL = 'http://20.244.56.144/test';
const AUTH_API_URL = 'http://20.244.56.144/test/auth';
let accessToken = '';
const validCompanies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
const validCategories = [
  'Phone', 'Computer', 'TV', 'Earphone', 'Tablet', 'Charger', 'Mouse',
  'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker', 'Headset',
  'Laptop', 'PC'
];

const fetchAccessToken = async () => {
  try {
    const response = await axios.post(AUTH_API_URL, {
      companyName: "AffordMed",
      clientID: "7356d7f6-2f62-4b4d-ad96-db0a6a544415",
      clientSecret: "dHlZZJYEmYPYWViz",
      ownerName: "Soumy",
      ownerEmail: "jainsoumya7378@gmail.com",
      rollNo: "1AY21CS185"
    });

    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
};
fetchAccessToken();
setInterval(fetchAccessToken, 3 * 60 * 1000);

app.get('/companies/:companyname/categories/:categoryname/products', async (req, res) => {
  const { companyname, categoryname } = req.params;
  const { top, page = 1, minPrice, maxPrice } = req.query;

  if (!validCategories.includes(categoryname)) {
    return res.status(400).json({ message: 'Invalid category name' });
  }
  if (!validCompanies.includes(companyname)) {
    return res.status(400).json({ message: 'Invalid company name' });
  }

  const queryParams = {};
  if (top) queryParams.top = top;
  if (minPrice) queryParams.minPrice = minPrice;
  if (maxPrice) queryParams.maxPrice = maxPrice;

  try {
    const response = await axios.get(`${BASE_API_URL}/companies/${companyname}/categories/${categoryname}/products`, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    response.data.sort((a, b) => a.price - b.price);

    // Calculate pagination
    const startIndex = (page - 1) * top;
    const endIndex = page * top;
    const paginatedProducts = response.data.slice(startIndex, endIndex);

    // Log the page number if top > 10
    if (top > 10) {
      console.log(`Requested for top=${top}, page=${page}`);
    }

    res.json(paginatedProducts);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.message });
    } else if (error.request) {
      res.status(500).json({ error: 'No response received from server' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
