require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.static("public"));
//Below is calling the api, feeding in the api key from my env file, and using pagination to load so many per 'page' so it doesn't load it all at one time!//
app.get("/api/birds", async (req, res) => {
try {
const searchFunction = req.query.search?.toLowerCase() || "";
const page = req.query.page || 1;
const pageSize = req.query.pageSize || 50;
const endpoint = `https://nuthatch.lastelm.software/v2/birds?page=${page}&pageSize=${pageSize}&region=North%20America&hasImg=true&operator=AND`;
const response = await fetch(endpoint, {
headers: {
"API-Key": process.env.API_KEY,
},
});
if (!response.ok) throw new Error(`API error: ${response.status}`);
//Below: taking the data from the API, and filtering it using .map to only show the data that I want to display.//
const allBirds = await response.json();
const birdsArray = allBirds.entities || allBirds.birds || [];
const filteredBirds = birdsArray
.filter((bird) => {
if (!searchFunction) return true;
return bird.name.toLowerCase().includes(searchFunction);
})
.map((bird) => ({
name: bird.name,
status: bird.status,
images:
bird.images && bird.images.length > 0
? [bird.images[0]]
: ["/images/no-image-available.jpg"],
}));
res.json(filteredBirds);
} catch (error) {
console.error("Error fetching birds:", error);
res.status(500).json({ error: "Failed to fetch birds" });
}
});

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
