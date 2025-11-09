require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/birds', async (req, res) => {
  const page = req.query.page || 1; 
  const pageSize = req.query.pageSize || 50;

  const endpoint = `https://nuthatch.lastelm.software/v2/birds?page=${page}&pageSize=${pageSize}&region=North%20America&hasImg=true&operator=AND`
  const response = await fetch(endpoint, {
    headers: {
      'API-Key': process.env.API_KEY } 
  });
  const allBirds = await response.json();
 const filteredBirds = allBirds.entities.map(bird => ({
    name: bird.name,
    status: bird.status,
    images: bird.images && bird.images.length > 0 ? [bird.images[0]] : ['/images/no-image-available.jpg'],
  }));
  res.json(filteredBirds); 
});

  app.use(express.static('public'));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});